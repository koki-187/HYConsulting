'use client';

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, MapPin, Home, Building2, LandPlot, ArrowRight, Database, Loader2, Search, ShieldCheck, AlertCircle, Mail, Phone, Train, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import AssessmentResult from "./AssessmentResult";


export default function AssessmentForm() {

  const [propertyType, setPropertyType] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [stationName, setStationName] = useState("");
  const [walkingMinutes, setWalkingMinutes] = useState("");
  const [area, setArea] = useState("");
  const [buildingYear, setBuildingYear] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [wantContact, setWantContact] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [contactError, setContactError] = useState<string | null>(null);

  const submitAssessment = trpc.assessment.submit.useMutation({
    onSuccess: (data) => {
      console.log("✅ Assessment API Success:", data);
      setAssessmentResult(data);
      setError(null);
      setIsSearching(false);
    },
    onError: (err) => {
      console.error("❌ Assessment API Error:", err);
      setError(err.message || "査定処理中にエラーが発生しました");
      setIsSearching(false);
    },
  });

  const validateContactInfo = (): boolean => {
    if (!wantContact) return true;
    
    setContactError(null);
    
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setContactError("有効なメールアドレスを入力してください");
      return false;
    }
    
    if (phone) {
      // Phone must be exactly 11 digits, no hyphens or other characters
      if (!phone.match(/^[0-9]{11}$/)) {
        setContactError("電話番号は11桁の数字で入力してください（ハイフン不要）");
        return false;
      }
    }
    
    if (!email && !phone) {
      setContactError("メールアドレスまたは電話番号を入力してください");
      return false;
    }
    
    if (!name) {
      setContactError("お名前を入力してください");
      return false;
    }
    
    return true;
  };

  const handleSearch = async () => {
    if (!propertyType) {
      setError("物件種別を選択してください");
      return;
    }

    if (!prefecture || !city) {
      setError("都道府県と市区町村を入力してください");
      return;
    }

    if (!validateContactInfo()) {
      return;
    }

    console.log("🔍 Starting assessment with data:", {
      propertyType,
      prefecture,
      city,
      area,
      buildingYear,
      stationName,
      walkingMinutes,
    });

    setIsSearching(true);
    setError(null);

    try {
      // Create location string from prefecture and city, with optional station info
      let location = `${prefecture}${city}`;
      if (stationName) {
        location += ` (${stationName}駅${walkingMinutes ? `徒歩${walkingMinutes}分` : ""})`;
      }

      console.log("📤 Sending API request...");
      
      // Add timeout wrapper (60 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("査定処理がタイムアウトしました。データベースが応答していません。しばらくしてから再度お試しください。")), 60000);
      });
      
      const apiPromise = submitAssessment.mutateAsync({
        propertyType,
        prefecture,
        city,
        location: location,
        floorArea: area ? parseFloat(area) : undefined,
        buildingAge: buildingYear ? parseInt(buildingYear) : undefined,
        ownerName: wantContact ? name : "Anonymous",
        email: wantContact ? email : "",
        phone: wantContact ? phone : undefined,
        nearestStation: stationName || undefined,
        walkingMinutes: walkingMinutes ? parseInt(walkingMinutes) : undefined,
      });
      
      const result = await Promise.race([apiPromise, timeoutPromise]);
      console.log("📥 API response received:", result);
    } catch (err) {
      console.error("❌ Assessment error in handleSearch:", err);
      const errorMessage = err instanceof Error ? err.message : "査定処理中にエラーが発生しました";
      setError(errorMessage);
      setIsSearching(false); // Ensure loading state is cleared
    } finally {
      console.log("🏁 Assessment process completed, setting isSearching to false");
      setIsSearching(false);
    }
  };

  const resetForm = () => {
    setPropertyType("");
    setPrefecture("");
    setCity("");
    setStationName("");
    setWalkingMinutes("");
    setArea("");
    setBuildingYear("");
    setAssessmentResult(null);
    setError(null);
    setWantContact(false);
    setEmail("");
    setPhone("");
    setContactError(null);
    
    // Scroll to assessment form section for better UX
    setTimeout(() => {
      const assessmentSection = document.getElementById('assessment');
      if (assessmentSection) {
        assessmentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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
          
          <h2 className="text-3xl lg:text-5xl font-bold text-primary mb-6 font-heading leading-tight">
            あなたの不動産、<br className="md:hidden" />
            <span className="text-accent relative inline-block px-2">
              今いくら？
              <span className="absolute bottom-1 left-0 w-full h-3 bg-accent/20 -z-10 transform -skew-x-12" />
            </span>
            即時査定
          </h2>
          <p className="text-lg text-slate-600 font-sans max-w-2xl mx-auto">
            物件情報を入力するだけで、膨大な取引事例と公的データを照合。<br />
            <span className="font-bold text-primary">概算価格を瞬時に算出</span>します。
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
                不動産価格を知りたい方はまずは即時査定
              </h3>

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
                        { value: "condo", label: "マンション", icon: Building2, desc: "区分所有" },
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
                              <SelectItem value="北海道">北海道</SelectItem>
                              <SelectItem value="青森県">青森県</SelectItem>
                              <SelectItem value="岩手県">岩手県</SelectItem>
                              <SelectItem value="宮城県">宮城県</SelectItem>
                              <SelectItem value="秋田県">秋田県</SelectItem>
                              <SelectItem value="山形県">山形県</SelectItem>
                              <SelectItem value="福島県">福島県</SelectItem>
                              <SelectItem value="茨城県">茨城県</SelectItem>
                              <SelectItem value="栃木県">栃木県</SelectItem>
                              <SelectItem value="群馬県">群馬県</SelectItem>
                              <SelectItem value="埼玉県">埼玉県</SelectItem>
                              <SelectItem value="千葉県">千葉県</SelectItem>
                              <SelectItem value="東京都">東京都</SelectItem>
                              <SelectItem value="神奈川県">神奈川県</SelectItem>
                              <SelectItem value="新潟県">新潟県</SelectItem>
                              <SelectItem value="富山県">富山県</SelectItem>
                              <SelectItem value="石川県">石川県</SelectItem>
                              <SelectItem value="福井県">福井県</SelectItem>
                              <SelectItem value="山梨県">山梨県</SelectItem>
                              <SelectItem value="長野県">長野県</SelectItem>
                              <SelectItem value="岐阜県">岐阜県</SelectItem>
                              <SelectItem value="静岡県">静岡県</SelectItem>
                              <SelectItem value="愛知県">愛知県</SelectItem>
                              <SelectItem value="三重県">三重県</SelectItem>
                              <SelectItem value="滋賀県">滋賀県</SelectItem>
                              <SelectItem value="京都府">京都府</SelectItem>
                              <SelectItem value="大阪府">大阪府</SelectItem>
                              <SelectItem value="兵庫県">兵庫県</SelectItem>
                              <SelectItem value="奈良県">奈良県</SelectItem>
                              <SelectItem value="和歌山県">和歌山県</SelectItem>
                              <SelectItem value="鳥取県">鳥取県</SelectItem>
                              <SelectItem value="島根県">島根県</SelectItem>
                              <SelectItem value="岡山県">岡山県</SelectItem>
                              <SelectItem value="広島県">広島県</SelectItem>
                              <SelectItem value="山口県">山口県</SelectItem>
                              <SelectItem value="徳島県">徳島県</SelectItem>
                              <SelectItem value="香川県">香川県</SelectItem>
                              <SelectItem value="愛媛県">愛媛県</SelectItem>
                              <SelectItem value="高知県">高知県</SelectItem>
                              <SelectItem value="福岡県">福岡県</SelectItem>
                              <SelectItem value="佐賀県">佐賀県</SelectItem>
                              <SelectItem value="長崎県">長崎県</SelectItem>
                              <SelectItem value="熊本県">熊本県</SelectItem>
                              <SelectItem value="大分県">大分県</SelectItem>
                              <SelectItem value="宮崎県">宮崎県</SelectItem>
                              <SelectItem value="鹿児島県">鹿児島県</SelectItem>
                              <SelectItem value="沖縄県">沖縄県</SelectItem>
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
                      <div className="space-y-4 pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-600 font-bold">最寄り駅情報（オプション）</p>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="stationName" className="text-sm font-bold text-slate-600 flex items-center gap-2">
                              <Train className="w-4 h-4" />
                              最寄り駅名
                            </Label>
                            <Input 
                              id="stationName" 
                              placeholder="例：横浜駅" 
                              className="h-14 text-lg bg-white border-slate-300 focus:ring-accent"
                              value={stationName}
                              onChange={(e) => setStationName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="walkingMinutes" className="text-sm font-bold text-slate-600 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              徒歩（分）
                            </Label>
                            <Input 
                              id="walkingMinutes" 
                              placeholder="例：10" 
                              type="number"
                              className="h-14 text-lg bg-white border-slate-300 focus:ring-accent"
                              value={walkingMinutes}
                              onChange={(e) => setWalkingMinutes(e.target.value)}
                            />
                          </div>
                        </div>
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

                  {/* Step 4: Contact Information (Optional) */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-accent text-primary font-bold w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-sm">4</span>
                      <Label className="text-xl font-bold text-primary">連絡先情報（オプション）</Label>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-6">
                      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <input 
                          type="checkbox"
                          id="wantContact"
                          checked={wantContact}
                          onChange={(e) => {
                            setWantContact(e.target.checked);
                            setContactError(null);
                          }}
                          className="w-5 h-5 rounded border-slate-300 text-accent cursor-pointer"
                        />
                        <label htmlFor="wantContact" className="flex-1 cursor-pointer">
                          <p className="font-bold text-slate-700">査定結果についてのご連絡を希望します</p>
                          <p className="text-sm text-slate-600 mt-1">メールアドレスまたは電話番号を提供いただくと、査定結果の詳細や関連情報をお送りできます。</p>
                        </label>
                      </div>

                      {wantContact && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          {contactError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                              <p className="text-red-700 text-sm">{contactError}</p>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-bold text-slate-600 flex items-center gap-2">
                              <span className="w-4 h-4 flex items-center justify-center text-primary font-bold text-xs">👤</span>
                              お名前
                            </Label>
                            <Input 
                              id="name" 
                              placeholder="例：山田 太郎" 
                              className="h-12 text-lg bg-white border-slate-300 focus:ring-accent"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold text-slate-600 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              メールアドレス
                            </Label>
                            <Input 
                              id="email" 
                              type="email"
                              placeholder="例：user@example.com" 
                              className="h-12 text-lg bg-white border-slate-300 focus:ring-accent"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-bold text-slate-600 flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              電話番号
                            </Label>
                            <Input 
                              id="phone" 
                              placeholder="例：09012345678（11桁の数字、ハイフン不要）" 
                              className="h-12 text-lg bg-white border-slate-300 focus:ring-accent"
                              value={phone}
                              onChange={(e) => {
                                // Only allow digits, max 11 characters
                                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                                setPhone(value);
                              }}
                              maxLength={11}
                              inputMode="numeric"
                              pattern="[0-9]{11}"
                            />
                          </div>

                          <p className="text-xs text-slate-500 mt-4">
                            ※ メールアドレスまたは電話番号のいずれかを入力してください。
                          </p>
                        </motion.div>
                      )}
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
                  <AssessmentResult
                    result={{
                      estimatedLowYen: assessmentResult?.estimatedLowYen || 0,
                      estimatedHighYen: assessmentResult?.estimatedHighYen || 0,
                      explanation: assessmentResult?.message || "",
                      compsUsedCount: assessmentResult?.compsUsedCount || 0,
                      marketTrend: assessmentResult?.marketAnalysis?.marketTrend || "stable",
                      pricePerM2: assessmentResult?.marketAnalysis?.avgPricePerM2 || 0,
                      comparableCount: assessmentResult?.marketAnalysis?.transactionCount || 0,
                      confidence: assessmentResult?.confidenceBreakdown?.totalScore || 75,
                      marketAnalysis: assessmentResult?.marketAnalysis,
                      confidenceBreakdown: assessmentResult?.confidenceBreakdown,
                    }}
                    propertyData={{
                      propertyType,
                      prefecture,
                      city,
                      location: stationName ? `${stationName}駅${walkingMinutes ? `徒歩${walkingMinutes}分` : ""}` : "",
                      nearestStation: stationName || undefined,
                      walkingMinutes: walkingMinutes ? parseInt(walkingMinutes) : undefined,
                      floorArea: area ? parseFloat(area) : undefined,
                      buildingAge: buildingYear ? parseInt(buildingYear) : undefined,
                    }}
                    marketAnalysis={assessmentResult?.marketAnalysis}
                    onReset={resetForm}
                  />

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
                          {prefecture} {city} {stationName && `(${stationName}駅${walkingMinutes ? `徒歩${walkingMinutes}分` : ""})`}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
