import { motion } from "framer-motion";

export default function SuccessStories() {
  return (
    <section
      id="success-stories"
      className="py-20 lg:py-32 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-[0.2em] text-primary uppercase border-b border-primary/30">
            Success Stories
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              お客様の成功事例
            </span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            HY Consulting のサポートで、多くのお客様が<br />
            人生の課題を解決し、新しい選択肢を手に入れています。
          </p>
        </motion.div>

        {/* Main Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute top-6 left-6 bg-primary/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold z-10">
              老後の資金計画
            </div>
            <img
              src="/success-story-3.png"
              alt="老後の資金計画 - HY Consulting"
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
