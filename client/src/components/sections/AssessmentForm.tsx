"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, MapPin, Home, Building2, LandPlot, ArrowRight, Database, Loader2, Search, ShieldCheck, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { trpc } from "@/lib/trpc";


export default function AssessmentForm() {

  const [propertyType, setPropertyType] = useState("house");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [buildingYear, setBuildingYear] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const submitAssessment = trpc.assessment.submit.useMutation({
    onSuccess: (data) => {
      setAssessmentResult(data);
      setError(null);

    },
    onError: (err) => {
      setError(err.message || "査定処理中にエラーが発生しました");

    },
  });

  const handleSearch = async () => {
    if (!prefecture || !city || !address) {
      setError("都道府県、市区町村、町名・番地を入力してください");

      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      await submitAssessment.mutateAsync({
        propertyType,
        prefecture,
        city,
        location: address,
        floorArea: area ? parseFloat(area) : undefined,
        buildingAge: buildingYear ? parseInt(buildingYear) : undefined,
        ownerName: "Anonymous",
        email: "",
      });
    } catch (err) {
      console.error("Assessment error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const resetForm = () => {
    setPropertyType("house");
    setPrefecture("");
    setCity("");
    setAddress("");
    setArea("");
    setBuildingYear("");
    setAssessmentResult(null);
    setError(null);
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
            <span className="font-bold text-primary">適正価格を瞬時に算出</span>します。匿名・無料です。
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
                不動産価格を知りたい方はまずはオンライン査定
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
            <AnimatePresence mode="wait">
              {!assessmentResult ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-10"
                >
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Step 1: Property Type */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-accent text-primary font-bold w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-sm">1</span>
                      <Label className="text-xl font-bold text-primary">物件種別を選んでください</Label>
                    </div>
                    <RadioGroup 
                      value={propertyType}
                      onValueChange={setPropertyType}
                      className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
                    >
                      {[
                        { value: "house", label: "戸建て", icon: Home, desc: "一軒家" },
                        { value: "mansion", label: "マンション", icon: Building2, desc: "区分所有" },
                        { value: "land", label: "土地", icon: LandPlot, desc: "更地・古家付" },
                        { value: "apartment", label: "アパート", icon: Home, desc: "一棟収益" },
                      ].map((type) => (
                        <div key={type.value}>
                          <RadioGroupItem value={type.value} id={type.value} className="peer sr-only" />
                          <Label
                            htmlFor={type.value}
                            className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-xl border-2 border-slate-100 cursor-pointer hover:bg-slate-50 hover:border-slate-300 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/5 peer-data-[state=checked]:shadow-md transition-all h-full group min-h-[120px] sm:min-h-[140px]"
                          >
                            <type.icon className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 group-hover:text-slate-500 peer-data-[state=checked]:text-accent transition-colors" />
                            <div className="text-center">
                              <span className="block font-bold text-base sm:text-lg text-slate-700 peer-data-[state=checked]:text-primary">{type.label}</span>
                              <span className="block text-[10px] sm:text-xs text-slate-400 mt-1">{type.desc}</span>
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
                          <Select value={prefecture} onValueChange={setPrefecture}>
                            <SelectTrigger className="h-14 text-lg bg-white border-slate-300 focus:ring-accent">
                              <SelectValue placeholder="選択してください" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tokyo">東京都</SelectItem>
                              <SelectItem value="kanagawa">神奈川県</SelectItem>
                              <SelectItem value="chiba">千葉県</SelectItem>
                              <SelectItem value="saitama">埼玉県</SelectItem>
                              <SelectItem value="osaka">大阪府</SelectItem>
                              <SelectItem value="kyoto">京都府</SelectItem>
                              <SelectItem value="hyogo">兵庫県</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-sm font-bold text-slate-600">市区町村 <span className="text-red-500">*</span></Label>
                          <Input 
                            id="city" 
                            placeholder="例：横浜市戸塚区" 
                            className="h-14 text-lg bg-white border-slate-300 focus:ring-accent"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-bold text-slate-600">町名・番地 <span className="text-xs font-normal text-slate-400 ml-2">※詳しいほど正確に査定できます</span></Label>
                        <Input 
                          id="address" 
                          placeholder="例：戸塚町1-2-3" 
                          className="h-14 text-lg bg-white border-slate-300 focus:ring-accent"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Property Details (Optional) */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-accent text-primary font-bold w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-sm">3</span>
                      <Label className="text-xl font-bold text-primary">物件の詳細（オプション）</Label>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="area" className="text-sm font-bold text-slate-600">面積（㎡）</Label>
                          <Input 
                            id="area" 
                            placeholder="例：100" 
                            type="number"
                            className="h-14 text-lg bg-white border-slate-300 focus:ring-accent"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="buildingYear" className="text-sm font-bold text-slate-600">築年数（年）</Label>
                          <Input 
                            id="buildingYear" 
                            placeholder="例：2000" 
                            type="number"
                            className="h-14 text-lg bg-white border-slate-300 focus:ring-accent"
                            value={buildingYear}
                            onChange={(e) => setBuildingYear(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button 
                      size="lg"
                      onClick={handleSearch}
                      disabled={isSearching || submitAssessment.isPending}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      {isSearching || submitAssessment.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          査定中...
                        </>
                      ) : (
                        <>
                          査定結果を見る
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  {/* Success Header */}
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="bg-green-100 rounded-full p-4">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">査定完了しました</h3>
                    <p className="text-slate-600">以下が査定結果です。詳細については公式サイトのお問い合わせフォームからご相談ください。</p>
                  </div>

                  {/* Result Card */}
                  <Card className="border-2 border-accent bg-accent/5 p-8">
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-slate-600 mb-2">査定対象物件</p>
                        <p className="text-lg font-bold text-slate-900">
                          {prefecture} {city} {address}
                        </p>
                      </div>

                      <div className="border-t border-slate-200 pt-6">
                        <p className="text-sm text-slate-600 mb-4">推定査定価格</p>
                        <div className="space-y-2">
                          <p className="text-4xl lg:text-5xl font-bold text-primary">
                            {assessmentResult?.estimatedPrice ? `¥${assessmentResult.estimatedPrice.toLocaleString()}` : "計算中..."}
                          </p>
                          <p className="text-sm text-slate-600">
                            {assessmentResult?.priceRange ? `（${assessmentResult.priceRange.min.toLocaleString()} ～ ${assessmentResult.priceRange.max.toLocaleString()}）` : ""}
                          </p>
                        </div>
                      </div>

                      {assessmentResult?.marketAnalysis && (
                        <div className="border-t border-slate-200 pt-6">
                          <p className="text-sm font-bold text-slate-900 mb-2">市場分析</p>
                          <p className="text-slate-600 text-sm leading-relaxed">{assessmentResult.marketAnalysis}</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      variant="outline"
                      size="lg"
                      onClick={resetForm}
                      className="flex-1 border-2 border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-6 rounded-lg"
                    >
                      別の物件を査定する
                    </Button>
                    <a 
                      href="https://hyconsulting.jp/contact" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button 
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
                      >
                        詳しく相談する
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </a>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex gap-4">
                      <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-blue-900 mb-2">ご注意</p>
                        <p className="text-sm text-blue-800">
                          本査定結果は参考値です。実際の査定価格は物件の状態、市場動向、その他の要因により異なる場合があります。詳細な査定については、公式サイトのお問い合わせフォームからご相談ください。
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
