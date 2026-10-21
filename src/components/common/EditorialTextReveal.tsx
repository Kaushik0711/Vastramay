import React from 'react';
import { motion } from 'motion/react';

export interface EditorialTextRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'blockquote';
  staggerDelay?: number;
  initialDelay?: number;
  italicIndices?: number[]; // indices of words to render in italic font-display
  highlightColor?: string;
}

export const EditorialTextReveal: React.FC<EditorialTextRevealProps> = ({
  text,
  className = '',
  as: Component = 'h1',
  staggerDelay = 0.05,
  initialDelay = 0.1,
  italicIndices = [],
}) => {
  const words = text.split(' ');

  return (
    <Component className={`relative ${className}`.trim()} aria-label={text}>
      <span aria-hidden="true" className="inline-block">
        {words.map((word, index) => {
          const isItalic = italicIndices.includes(index);

          return (
            <span
              key={`${word}-${index}`}
              className="inline-block overflow-hidden align-top mr-[0.26em] last:mr-0"
            >
              <motion.span
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1], // Luxury cubic ease
                  delay: initialDelay + index * staggerDelay,
                }}
                className={`inline-block ${isItalic ? 'italic font-display text-brand-purple' : ''}`}
              >
                {word}
              </motion.span>
            </span>
          );
        })}
      </span>
    </Component>
  );
};

export default EditorialTextReveal;
