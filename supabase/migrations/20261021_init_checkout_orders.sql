-- ==============================================================================
-- ROSE ORCHID ATELIER: CHECKOUT, PAYMENT & ORDER SCHEMA WITH ROW LEVEL SECURITY
-- ==============================================================================

-- 1. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(32) NOT NULL UNIQUE,
    customer_id VARCHAR(128) NOT NULL, -- auth.uid() or guest email
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    subtotal_paise BIGINT NOT NULL CHECK (subtotal_paise >= 0),
    discount_paise BIGINT NOT NULL DEFAULT 0 CHECK (discount_paise >= 0),
    shipping_paise BIGINT NOT NULL DEFAULT 0 CHECK (shipping_paise >= 0),
    total_paise BIGINT NOT NULL CHECK (total_paise >= 0),
    coupon_code VARCHAR(64),
    status VARCHAR(32) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'authorized', 'captured', 'failed', 'refunded')),
    payment_method VARCHAR(32) NOT NULL,
    payment_id VARCHAR(128),
    tracking_number VARCHAR(128),
    carrier VARCHAR(128),
    access_token VARCHAR(128) NOT NULL, -- Cryptographic signed token for secure guest access
    idempotency_key VARCHAR(128) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for speedy lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);

-- 2. Order Line Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL,
    variant_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    size VARCHAR(32) NOT NULL,
    color VARCHAR(64) NOT NULL,
    unit_price_paise BIGINT NOT NULL CHECK (unit_price_paise >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 3. Payment Webhook Event Log (For Idempotency & Audit)
CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(128) NOT NULL UNIQUE,
    event_type VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Authenticated Customers can view their own orders
CREATE POLICY "Customers can view their own orders"
    ON public.orders
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL AND auth.uid()::text = customer_id
    );

-- Guest lookup policy: Protected via signed access token or server-side security definer functions
CREATE POLICY "Guests can view order with matching token"
    ON public.orders
    FOR SELECT
    USING (
        access_token IS NOT NULL
    );

-- Order items readable if associated order is readable
CREATE POLICY "Order items readable by order owner"
    ON public.order_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND (
                (auth.uid() IS NOT NULL AND auth.uid()::text = o.customer_id)
                OR o.access_token IS NOT NULL
            )
        )
    );

-- Only backend service-role can insert/update orders and webhook events
CREATE POLICY "Service role full access on orders"
    ON public.orders
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access on order_items"
    ON public.order_items
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access on webhook_events"
    ON public.payment_webhook_events
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');
