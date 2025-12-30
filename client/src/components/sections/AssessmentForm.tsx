import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, MapPin, Home, Building2, LandPlot, ArrowRight } from "lucide-react";

export default function AssessmentForm() {
  const [propertyType, setPropertyType] = useState("house");

  return (
    <section id="assessment" className="py-24 bg-slate-50 relative">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-6">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            <span className="text-primary font-bold">国土交通省データベース連動</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6 font-heading">
            <span className="text-accent">60秒</span>で完了！<br />
            無料不動産査定
          </h2>
          <p className="text-lg text-slate-600 font-sans">
            物件情報を入力するだけで、概算価格をすぐに算出します。<br />
            匿名での査定も可能ですので、お気軽にお試しください。
          </p>
        </div>

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="bg-primary p-6 text-center">
            <h3 className="text-xl font-bold text-white font-heading">査定スタート</h3>
            <p className="text-white/80 text-sm mt-2">以下のフォームにご入力ください</p>
          </div>

          <div className="p-8 lg:p-12 space-y-10">
            
            {/* Step 1: Property Type */}
            <div className="space-y-4">
              <Label className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="bg-accent text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                物件種別を選択してください
              </Label>
              <RadioGroup 
                defaultValue="house" 
                onValueChange={setPropertyType}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  { value: "house", label: "戸建て", icon: Home },
                  { value: "mansion", label: "マンション", icon: Building2 },
                  { value: "land", label: "土地", icon: LandPlot },
                  { value: "apartment", label: "アパート", icon: Building2 },
                ].map((type) => (
                  <div key={type.value}>
                    <RadioGroupItem value={type.value} id={type.value} className="peer sr-only" />
                    <Label
                      htmlFor={type.value}
                      className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg border-2 border-slate-200 cursor-pointer hover:bg-slate-50 peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/5 transition-all h-full"
                    >
                      <type.icon className="w-8 h-8 text-slate-400 peer-data-[state=checked]:text-accent" />
                      <span className="font-bold text-slate-600 peer-data-[state=checked]:text-primary">{type.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Step 2: Location */}
            <div className="space-y-4">
              <Label className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="bg-accent text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                物件の所在地を入力してください
              </Label>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="prefecture" className="text-sm text-slate-500">都道府県</Label>
                  <Select>
                    <SelectTrigger className="h-12 text-lg">
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
                  <Label htmlFor="city" className="text-sm text-slate-500">市区町村</Label>
                  <Input id="city" placeholder="例：横浜市戸塚区" className="h-12 text-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm text-slate-500">それ以降の住所（番地・建物名など）</Label>
                <Input id="address" placeholder="例：戸塚町1-2-3 ハイツ戸塚101" className="h-12 text-lg" />
              </div>
            </div>

            {/* Step 3: Details */}
            <div className="space-y-4">
              <Label className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="bg-accent text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                物件の詳細情報（概算で構いません）
              </Label>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="area" className="text-sm text-slate-500">
                    {propertyType === "mansion" ? "専有面積" : "土地面積"} (㎡)
                  </Label>
                  <Input id="area" type="number" placeholder="例：80" className="h-12 text-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm text-slate-500">築年数 (年)</Label>
                  <Input id="age" type="number" placeholder="例：20" className="h-12 text-lg" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 text-center">
              <Button className="w-full md:w-auto bg-secondary hover:bg-secondary/90 text-white text-xl font-bold px-12 py-8 rounded-md shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                査定結果を見る（無料）
                <ArrowRight className="w-6 h-6" />
              </Button>
              <p className="mt-4 text-sm text-slate-500">
                ※プライバシーポリシーに同意の上、ご利用ください。<br />
                ※強引な営業は一切いたしませんのでご安心ください。
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
