import { motion } from 'framer-motion';
import AuthCard from './AuthCard';

interface AnimatedCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ title, subtitle, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AuthCard title={title} subtitle={subtitle}>
        {children}
      </AuthCard>
    </motion.div>
  );
};

export default AnimatedCard;