import { motion } from "framer-motion";

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-[0.2em] text-primary uppercase border-b border-primary/30">
            Why Choose Us
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            なぜHYコンサルティングが<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              選ばれているのか？
            </span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            複雑な悩みも、プロのネットワークと幅広い知識で、<br />
            あなたに最適な解決策をワンストップで実現します。
          </p>
        </motion.div>

        {/* 3 feature cards removed as per user request */}
      </div>
    </section>
  );
}
