import { ComponentProps } from '@/editor/types';
import { JSX } from 'react/jsx-runtime';
import React, { useEffect, Ref } from 'react';

interface ModalProps extends ComponentProps {
  as?: keyof JSX.IntrinsicElements;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const Modal = React.forwardRef<HTMLElement, ModalProps>(
  ({ as = 'div', isOpen, onClose, title, style, className, children, ...props }, ref) => {
    const Component = as as keyof JSX.IntrinsicElements;

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
      <div
        ref={ref as Ref<HTMLDivElement> | undefined}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          ...style,
        }}
        className={className}
        {...props}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            minWidth: '300px',
            maxWidth: '80%',
            maxHeight: '80vh',
            overflow: 'auto',
          }}
        >
          {title && (
            <div style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: 'bold' }}>
              {title}
            </div>
          )}
          {children}
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';