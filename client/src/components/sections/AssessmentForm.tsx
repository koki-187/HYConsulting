import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, MapPin, Home, Building2, LandPlot, ArrowRight, Database, Loader2, Search, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AssessmentForm() {
  const [propertyType, setPropertyType] = useState("house");
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate API call / Database search
    setTimeout(() => {
      setIsSearching(false);
      setShowResult(true);
    }, 2500);
  };

  return (
    <section id="assessment" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-5xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white border border-accent/30 px-6 py-2 rounded-full mb-6 shadow-sm"
          >
            <Database className="w-5 h-5 text-accent" />
            <span className="text-primary font-bold tracking-wide">国土交通省 地価公示データ連動</span>
          </motion.div>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-primary mb-6 font-heading leading-tight">
            あなたの不動産、<br className="md:hidden" />
            <span className="text-accent relative inline-block px-2">
              今いくら？
              <span className="absolute bottom-1 left-0 w-full h-3 bg-accent/20 -z-10 transform -skew-x-12" />
            </span>
            で即時査定
          </h2>
          <p className="text-lg text-slate-600 font-sans max-w-2xl mx-auto">
            物件情報を入力するだけで、膨大な取引事例と公的データを照合。<br />
            <span className="font-bold text-primary">AIが適正価格を瞬時に算出</span>します。匿名・無料です。
          </p>
        </div>

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative"
        >
          {/* Header Bar */}
          <div className="bg-primary p-6 flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl lg:text-2xl font-bold text-white font-heading flex items-center gap-3">
                <Search className="w-6 h-6 text-accent" />
                無料スピード査定
              </h3>
              <p className="text-primary-foreground/80 text-sm mt-1">最短60秒で入力完了・その場で結果表示</p>
              <div className="mt-2 inline-block bg-white/20 px-3 py-1 rounded text-xs text-white font-bold border border-white/30">
                国土交通省「不動産取引価格情報」データベース連動
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent transform skew-x-12" />
          </div>

          <div className="p-6 lg:p-10">
            {!showResult ? (
              <div className="space-y-10">
                {/* Step 1: Property Type */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-accent text-primary font-bold w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-sm">1</span>
                    <Label className="text-xl font-bold text-primary">物件種別を選んでください</Label>
                  </div>
                  <RadioGroup 
                    defaultValue="house" 
                    onValueChange={setPropertyType}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    {[
                      { value: "house", label: "戸建て", icon: Home, desc: "一軒家" },
                      { value: "mansion", label: "マンション", icon: Building2, desc: "区分所有" },
                      { value: "land", label: "土地", icon: LandPlot, desc: "更地・古家付" },
                      { value: "apartment", label: "アパート", icon: Building2, desc: "一棟収益" },
                    ].map((type) => (
                      <div key={type.value}>
                        <RadioGroupItem value={type.value} id={type.value} className="peer sr-only" />
                        <Label
                          htmlFor={type.value}
                          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-slate-100 cursor-pointer hover:bg-slate-50 hover:border-slate-300 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/5 peer-data-[state=checked]:shadow-md transition-all h-full group"
                        >
                          <type.icon className="w-10 h-10 text-slate-400 group-hover:text-slate-500 peer-data-[state=checked]:text-accent transition-colors" />
                          <div className="text-center">
                            <span className="block font-bold text-lg text-slate-700 peer-data-[state=checked]:text-primary">{type.label}</span>
                            <span className="block text-xs text-slate-400 mt-1">{type.desc}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Step 2: Location */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-accent text-primary font-bold w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-sm">2</span>
                    <Label className="text-xl font-bold text-primary">所在地を入力してください</Label>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="prefecture" className="text-sm font-bold text-slate-600">都道府県 <span className="text-red-500">*</span></Label>
                        <Select>
                          <SelectTrigger className="h-14 text-lg bg-white border-slate-300 focus:ring-accent">
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tokyo">東京都</SelectItem>
                            <SelectItem value="kanagawa">神奈川県</SelectItem>
                            <SelectItem value="chiba">千葉県</SelectItem>
                            <SelectItem value="saitama">埼玉県</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-bold text-slate-600">市区町村 <span className="text-red-500">*</span></Label>
                        <Input id="city" placeholder="例：横浜市戸塚区" className="h-14 text-lg bg-white border-slate-300 focus:ring-accent" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-bold text-slate-600">町名・番地 <span className="text-xs font-normal text-slate-400 ml-2">※詳しいほど正確に査定できます</span></Label>
                      <Input id="address" placeholder="例：戸塚町1-2-3" className="h-14 text-lg bg-white border-slate-300 focus:ring-accent" />
                    </div>
                  </div>
                </div>

                {/* Step 3: Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-accent text-primary font-bold w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-sm">3</span>
                    <Label className="text-xl font-bold text-primary">物件の詳細（概算でOK）</Label>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="area" className="text-sm font-bold text-slate-600">
                          {propertyType === "mansion" ? "専有面積" : "土地面積"} (㎡)
                        </Label>
                        <div className="relative">
                          <Input id="area" type="number" placeholder="80" className="h-14 text-lg bg-white border-slate-300 focus:ring-accent pr-12" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">㎡</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age" className="text-sm font-bold text-slate-600">築年数 (年)</Label>
                        <div className="relative">
                          <Input id="age" type="number" placeholder="20" className="h-14 text-lg bg-white border-slate-300 focus:ring-accent pr-12" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">年</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="w-full bg-secondary hover:bg-secondary/90 text-white text-xl lg:text-2xl font-bold py-8 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 relative overflow-hidden group"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-8 h-8 animate-spin" />
                        データベース照合中...
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">査定結果を見る（無料）</span>
                        <ArrowRight className="w-8 h-8 relative z-10 group-hover:translate-x-2 transition-transform" />
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      </>
                    )}
                  </Button>
                  <p className="mt-4 text-center text-sm text-slate-500">
                    <ShieldCheck className="w-4 h-4 inline mr-1 text-primary" />
                    個人情報は厳重に管理され、許可なく公開されることはありません。
                  </p>
                </div>
              </div>
            ) : (
              /* Result View (Mock) */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-4">査定が完了しました</h3>
                <p className="text-slate-600 mb-8">
                  入力された条件に基づく概算査定額は以下の通りです。<br />
                  より正確な価格を知りたい場合は、無料訪問査定をご利用ください。
                </p>
                
                <Card className="max-w-md mx-auto bg-slate-50 border-2 border-accent/50 p-8 mb-8">
                  <p className="text-sm text-slate-500 font-bold mb-2">推定価格範囲</p>
                  <p className="text-4xl lg:text-5xl font-bold text-primary font-heading">
                    3,280<span className="text-2xl text-slate-600 font-normal ml-1">万円</span>
                    <span className="mx-2 text-slate-400 text-2xl">~</span>
                    3,550<span className="text-2xl text-slate-600 font-normal ml-1">万円</span>
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-400 text-left">
                    ※国土交通省の地価公示データおよび近隣の取引事例に基づいた概算です。
                  </div>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white text-lg font-bold px-8 py-6"
                    onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    正確な査定を依頼する
                  </Button>
                  <Button 
                    variant="outline"
                    className="text-slate-600 text-lg font-bold px-8 py-6"
                    onClick={() => setShowResult(false)}
                  >
                    条件を変更して再査定
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
