"use client";

import { motion } from "framer-motion";
import { CheckCircle2, MapPin, Lightbulb, ArrowRight } from "lucide-react";

export default function AssessmentFlow() {
  const steps = [
    {
      number: 1,
      title: "無料査定",
      description: "オンラインで簡単に不動産の概算価格を把握",
      icon: CheckCircle2,
      color: "from-blue-500 to-blue-600",
    },
    {
      number: 2,
      title: "訪問査定",
      description: "プロが現地で詳細な調査を実施。より正確な価格を算出",
      icon: MapPin,
      color: "from-accent to-accent/80",
    },
    {
      number: 3,
      title: "最適なプランのご提案",
      description: "売却、活用、相続対策など、あなたに最適な選択肢をご提案",
      icon: Lightbulb,
      color: "from-primary to-primary/80",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center">
        <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
          次のアクションは？
        </h3>
        <p className="text-slate-600 text-lg">
          正確な価格を知りたい場合は、訪問査定をご依頼ください
        </p>
      </div>

      {/* Flow Steps */}
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Step Card */}
              <div className="bg-white rounded-lg p-6 border-2 border-slate-200 hover:border-primary/50 transition-all h-full">
                {/* Step Number */}
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${step.color} text-white font-bold text-lg mb-4`}
                >
                  {step.number}
                </div>

                {/* Content */}
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  {step.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="bg-primary text-white p-2 rounded-full">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8 border-2 border-primary/20 text-center"
      >
        <h4 className="text-2xl font-bold text-slate-900 mb-3">
          正確な価格を知りたい方へ
        </h4>
        <p className="text-slate-700 mb-6 max-w-2xl mx-auto">
          無料査定の結果をもとに、プロが現地で詳細な調査を実施します。
          <br />
          より正確な価格と、あなたに最適な活用方法をご提案させていただきます。
        </p>
        <button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg">
          訪問査定をご依頼
        </button>
      </motion.div>
    </div>
  );
}
