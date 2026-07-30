import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface ConfirmationMessageProps {
  title: string;
  message: string;
}

export function ConfirmationMessage({ title, message }: ConfirmationMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-16 px-6"
      data-testid="confirmation-message"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <CheckCircle className="w-16 h-16 text-secondary mb-6" />
      </motion.div>
      <h3 className="text-2xl font-serif font-medium mb-3 text-center">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md leading-relaxed">{message}</p>
    </motion.div>
  );
}
