import { motion } from 'framer-motion';
import { Shield, Clock, Sparkles } from 'lucide-react';

type BadgeVariant = 'pattern1' | 'pattern2' | 'pattern3';

interface BadgeVariantsProps {
  variant: BadgeVariant;
}

export default function BadgeVariants({ variant }: BadgeVariantsProps) {
  if (variant === 'pattern1') {
    return <Pattern1Badges />;
  }
  
  if (variant === 'pattern2') {
    return <Pattern2Badges />;
  }
  
  return <Pattern3Badges />;
}

// Pattern 1: モダンフラットデザイン（シンプル・洗練）
function Pattern1Badges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-4">
      {/* 匿名・無料 Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <Shield className="w-5 h-5 text-pink-600" strokeWidth={2} />
        <div className="flex flex-col leading-tight">
          <span className="text-pink-700 font-bold text-sm tracking-wide">
            匿名・無料
          </span>
          <span className="text-pink-500 text-[9px] font-medium uppercase tracking-wider">
            Anonymous & Free
          </span>
        </div>
      </motion.div>

      {/* 最短60秒 Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <Clock className="w-5 h-5 text-blue-600" strokeWidth={2} />
        <div className="flex flex-col leading-tight">
          <span className="text-blue-700 font-bold text-sm tracking-wide">
            最短60秒で入力完了
          </span>
          <span className="text-blue-500 text-[9px] font-medium tracking-wider">
            その場で結果表示
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// Pattern 2: グラデーション強調デザイン（視覚的インパクト）
function Pattern2Badges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-4">
      {/* 匿名・無料 Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.3
        }}
        className="relative inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl shadow-lg overflow-hidden group"
        style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #dc2626 100%)',
        }}
      >
        {/* Animated background overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1.5
          }}
        />
        
        <div className="relative flex items-center gap-2.5">
          <Shield className="w-6 h-6 text-white drop-shadow-lg" fill="white" strokeWidth={0} />
          <div className="flex flex-col leading-tight">
            <span className="text-white font-extrabold text-base tracking-wide drop-shadow">
              匿名・無料
            </span>
            <span className="text-white/90 text-[9px] font-semibold uppercase tracking-widest">
              Anonymous & Free
            </span>
          </div>
          <Sparkles className="w-5 h-5 text-yellow-300 drop-shadow-lg" fill="currentColor" />
        </div>
      </motion.div>

      {/* 最短60秒 Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.4
        }}
        className="relative inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl shadow-lg overflow-hidden group"
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
        }}
      >
        {/* Animated background overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1.5,
            delay: 0.5
          }}
        />
        
        <div className="relative flex items-center gap-2.5">
          <Clock className="w-6 h-6 text-white drop-shadow-lg" fill="white" strokeWidth={0} />
          <div className="flex flex-col leading-tight">
            <span className="text-white font-extrabold text-base tracking-wide drop-shadow">
              最短60秒で入力完了
            </span>
            <span className="text-white/90 text-[9px] font-semibold tracking-widest">
              その場で結果表示
            </span>
          </div>
          <Sparkles className="w-5 h-5 text-yellow-300 drop-shadow-lg" fill="currentColor" />
        </div>
      </motion.div>
    </div>
  );
}

// Pattern 3: アイコン強調デザイン（情報伝達重視）
function Pattern3Badges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-4">
      {/* 匿名・無料 Badge */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-white border-2 border-pink-300 shadow-md hover:shadow-lg hover:border-pink-400 transition-all"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
          <Shield className="w-7 h-7 text-white" fill="white" strokeWidth={0} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-pink-700 font-bold text-base tracking-wide">
            匿名・無料
          </span>
          <span className="text-pink-500 text-[10px] font-medium uppercase tracking-wider">
            Anonymous & Free
          </span>
        </div>
      </motion.div>

      {/* 最短60秒 Badge */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-white border-2 border-blue-300 shadow-md hover:shadow-lg hover:border-blue-400 transition-all"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <Clock className="w-7 h-7 text-white" fill="white" strokeWidth={0} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-blue-700 font-bold text-base tracking-wide">
            最短60秒で入力完了
          </span>
          <span className="text-blue-500 text-[10px] font-medium tracking-wider">
            その場で結果表示
          </span>
        </div>
      </motion.div>
    </div>
  );
}
