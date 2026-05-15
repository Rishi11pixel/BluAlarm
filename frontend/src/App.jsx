import { useState } from "react";
import { FiArrowRight, FiCheck, FiAlertCircle, FiCalendar } from "react-icons/fi";

export default function App() {

  const [fromCity, setFromCity] = useState("DEL");

  const [toCity, setToCity] = useState("BOM");

  const [email, setEmail] = useState("");

  const [preferredHour, setPreferredHour] = useState(13);

  const [flexibility, setFlexibility] = useState(4);

  const [travelDate, setTravelDate] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [error, setError] = useState(null);

  const [success, setSuccess] = useState(false);


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError(null);
    setSuccess(false);

    // Validation
    if (!travelDate) {
      setError("Please select your travel date from the calendar.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!fromCity || !toCity) {
      setError("Please enter both departure and destination cities.");
      return;
    }

    setLoading(true);

    const data = {
      from_city: fromCity,
      to_city: toCity,
      email: email,
      preferred_hour: Number(preferredHour),
      flexibility: Number(flexibility),
      travel_date: travelDate
    };

    try {

      const response = await fetch(
        "${process.env.VITE_API_URL}/check-flights",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        let serverMessage = `Server error: ${response.statusText}`;

        try {
          const errorBody = await response.json();

          if (errorBody?.detail) {
            serverMessage = errorBody.detail;
          }
        } catch {
          // Keep fallback message when response body is not JSON.
        }

        throw new Error(serverMessage);
      }

      const result = await response.json();

      setResult(result);
      setSuccess(true);

    } catch (error) {

      console.error("FETCH ERROR:", error);

      setError(error.message || "Failed to activate alarm. Please try again.");

    } finally {

      setLoading(false);
    }
  };


  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden relative">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 blur-3xl rounded-full opacity-60 animate-pulse" style={{animationDuration: "4s"}} />

        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/20 blur-3xl rounded-full opacity-40 animate-pulse" style={{animationDuration: "5s"}} />

        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full opacity-30" />

      </div>

      {/* Loading Screen */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-full max-w-sm mx-auto px-6 animate-fade-in">
            
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 border border-white/15 backdrop-blur-2xl rounded-3xl p-16 shadow-2xl">
              
              {/* Microscope with Airplane */}
              <div className="flex justify-center mb-12">
                <div className="relative w-40 h-40">
                  
                  {/* Microscope SVG - Cleaner Design */}
                  <svg viewBox="0 0 200 240" className="w-full h-full opacity-80">
                    {/* Objective Lens with Glow */}
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* Eyepiece */}
                    <circle cx="100" cy="35" r="12" fill="none" stroke="#60A5FA" strokeWidth="2" opacity="0.6"/>
                    
                    {/* Tube */}
                    <rect x="93" y="50" width="14" height="75" fill="none" stroke="#60A5FA" strokeWidth="2" opacity="0.6"/>
                    
                    {/* Objective Lens - Main */}
                    <circle cx="100" cy="145" r="20" fill="none" stroke="#06B6D4" strokeWidth="2.5" filter="url(#glow)"/>
                    <circle cx="100" cy="145" r="14" fill="none" stroke="#06B6D4" strokeWidth="1.5" opacity="0.5"/>
                    
                    {/* Stage */}
                    <rect x="65" y="170" width="70" height="12" fill="none" stroke="#A78BFA" strokeWidth="2" opacity="0.6"/>
                  </svg>
                  
                  {/* Animated Airplane in Center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl animate-bounce" style={{animationDuration: "2s"}}>
                      ✈️
                    </div>
                  </div>
                  
                  {/* Orbiting Rupees */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-28 h-28 animate-spin" style={{animationDuration: "3s"}}>
                      <span className="absolute text-lg font-bold text-green-400" style={{top: "-40px", left: "50%", transform: "translateX(-50%)"}}>₹</span>
                      <span className="absolute text-lg font-bold text-green-400" style={{bottom: "-40px", left: "50%", transform: "translateX(-50%)"}}>₹</span>
                      <span className="absolute text-lg font-bold text-green-400" style={{top: "50%", right: "-40px", transform: "translateY(-50%)"}}>₹</span>
                      <span className="absolute text-lg font-bold text-green-400" style={{top: "50%", left: "-40px", transform: "translateY(-50%)"}}>₹</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Text Content */}
              <div className="text-center space-y-2 mb-8">
                <h3 className="text-xl font-bold text-white">
                  Analyzing Prices
                </h3>
                <p className="text-sm text-slate-300 font-light">
                  Finding the best deals for you
                </p>
              </div>
              
              {/* Minimal Chart Bars */}
              <div className="flex items-end justify-center gap-1.5 h-12 mb-2">
                <div className="w-1.5 bg-gradient-to-t from-green-400 to-green-300 rounded-sm" style={{height: "40%"}} />
                <div className="w-1.5 bg-gradient-to-t from-blue-400 to-blue-300 rounded-sm animate-pulse" style={{height: "70%"}} />
                <div className="w-1.5 bg-gradient-to-t from-cyan-400 to-cyan-300 rounded-sm" style={{height: "55%"}} />
                <div className="w-1.5 bg-gradient-to-t from-green-400 to-green-300 rounded-sm animate-pulse" style={{height: "65%", animationDelay: "0.3s"}} />
                <div className="w-1.5 bg-gradient-to-t from-blue-400 to-blue-300 rounded-sm" style={{height: "48%"}} />
              </div>
              
              {/* Loading Dots */}
              <div className="flex gap-1.5 justify-center">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: "0s"}} />
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}} />
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: "0.4s"}} />
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16" style={{opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto'}}>

        <div className="grid grid-cols-1 gap-12">

          {/* TOP SECTION - Hero */}
          <div className="space-y-8 animate-fade-in text-center">

            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-full border border-blue-400/40 bg-gradient-to-r from-blue-500/15 to-cyan-500/10 text-blue-200 text-sm backdrop-blur-md hover:border-blue-400/60 transition-all duration-300 mx-auto">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Smart Flight Tracking Platform
            </div>


            <div className="space-y-4">

              <h1 className="text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-cyan-200 leading-tight tracking-tighter">
                Blu<span className="text-blue-300">Alarm</span>
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed font-light max-w-2xl mx-auto">

                Stop refreshing flight websites. Get automatic price alerts the moment your ideal flights drop to unbeatable prices.

              </p>

            </div>


            <div className="grid grid-cols-3 gap-4 pt-6 max-w-xl mx-auto">

              <div className="group bg-gradient-to-br from-white/10 to-white/5 border border-white/15 rounded-xl p-4 backdrop-blur-md hover:from-blue-500/15 hover:to-blue-400/10 transition-all duration-300 hover:border-blue-400/40">

                <p className="text-3xl font-bold text-blue-300">24/7</p>

                <p className="text-xs text-slate-400 mt-2 font-medium">CONTINUOUS MONITORING</p>

              </div>


              <div className="group bg-gradient-to-br from-white/10 to-white/5 border border-white/15 rounded-xl p-4 backdrop-blur-md hover:from-cyan-500/15 hover:to-cyan-400/10 transition-all duration-300 hover:border-cyan-400/40">

                <p className="text-3xl font-bold text-cyan-300">Live</p>

                <p className="text-xs text-slate-400 mt-2 font-medium">PRICE TRACKING</p>

              </div>


              <div className="group bg-gradient-to-br from-white/10 to-white/5 border border-white/15 rounded-xl p-4 backdrop-blur-md hover:from-purple-500/15 hover:to-purple-400/10 transition-all duration-300 hover:border-purple-400/40">

                <p className="text-3xl font-bold text-purple-300">⚡ Fast</p>

                <p className="text-xs text-slate-400 mt-2 font-medium">EMAIL ALERTS</p>

              </div>

            </div>

          </div>


          {/* BOTTOM SECTION - Form */}
          <div className="relative group animate-slide-up">

            {/* Gradient Blur Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 blur-3xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Card */}
            <div className="relative bg-white/8 border border-white/15 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl hover:border-white/25 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">

              <div className="mb-10">

                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                  Create Alert
                </h2>

                <p className="text-slate-400 mt-3 text-sm font-light">
                  Set your preferences and receive instant notifications for deal flights.
                </p>

              </div>


              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/40 flex gap-3 animate-slide-down">
                  <FiAlertCircle className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/15 border border-green-500/40 flex gap-3 animate-slide-down">
                  <FiCheck className="text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-300">✈ BluAlarm activated! Check your email for updates.</p>
                </div>
              )}


              <form className="space-y-6" onSubmit={handleSubmit}>

                {/* City Inputs */}
                <div className="grid grid-cols-2 gap-4">

                  <div className="group">

                    <label className="text-xs text-slate-300 block mb-3 font-semibold tracking-wide">
                      DEPARTURE
                    </label>

                    <input
                      type="text"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value.toUpperCase())}
                      placeholder="DEL"
                      maxLength="3"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-400 font-medium text-center uppercase group-hover:bg-white/10 group-hover:border-blue-500/40"
                    />

                  </div>


                  <div className="group">

                    <label className="text-xs text-slate-300 block mb-3 font-semibold tracking-wide">
                      ARRIVAL
                    </label>

                    <input
                      type="text"
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value.toUpperCase())}
                      placeholder="BOM"
                      maxLength="3"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white placeholder-slate-400 font-medium text-center uppercase group-hover:bg-white/10 group-hover:border-cyan-500/40"
                    />

                  </div>

                </div>


                {/* Email Input */}
                <div className="group">

                  <label className="text-xs text-slate-300 block mb-3 font-semibold tracking-wide">
                    EMAIL ADDRESS
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-500 group-hover:bg-white/10 group-hover:border-blue-500/40"
                  />

                </div>


                {/* Travel Date */}
                <div className="group">

                  <label className="text-xs text-slate-300 block mb-3 font-semibold tracking-wide">
                    TRAVEL DATE
                  </label>

                  <div className="relative">
                    <FiCalendar className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-400 group-hover:bg-white/10 group-hover:border-blue-500/40"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Date display follows device locale, but BluAlarm sends it safely in backend format.
                  </p>

                </div>


                {/* Preferred Hour */}
                <div className="group">

                  <label className="text-xs text-slate-300 block mb-3 font-semibold tracking-wide">
                    PREFERRED DEPARTURE HOUR (24H)
                  </label>

                  <input
                    type="number"
                    value={preferredHour}
                    onChange={(e) => setPreferredHour(e.target.value)}
                    placeholder="13"
                    min="0"
                    max="23"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-400 group-hover:bg-white/10 group-hover:border-blue-500/40"
                  />

                </div>


                {/* Flexibility */}
                <div className="group">

                  <label className="text-xs text-slate-300 block mb-3 font-semibold tracking-wide">
                    FLEXIBILITY RANGE (HOURS)
                  </label>

                  <input
                    type="number"
                    value={flexibility}
                    onChange={(e) => setFlexibility(e.target.value)}
                    placeholder="4"
                    min="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-400 group-hover:bg-white/10 group-hover:border-blue-500/40"
                  />

                </div>


                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-600 transition-all duration-300 font-bold text-lg shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 disabled:shadow-none disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider flex items-center justify-center gap-2 group"
                >

                  {
                    loading
                      ? <><span className="inline-block animate-spin">⟳</span> Activating...</>
                      : <><FiArrowRight className="group-hover:translate-x-1 transition-transform" /> Activate BluAlarm</>
                  }

                </button>

              </form>


              {/* Results Section */}
              {result && (

                <div className="mt-10 space-y-5 border-t border-white/10 pt-8 animate-fade-in">

                  <h3 className="text-xl font-bold text-blue-200">
                    ✈ Flight Results
                  </h3>


                  {result.overall && (

                    <div className="bg-gradient-to-br from-green-500/15 to-green-400/5 border border-green-500/30 rounded-xl p-6 hover:border-green-500/60 transition-all duration-300">

                      <div className="flex items-center justify-between mb-4">

                        <h4 className="text-sm font-bold text-green-300 uppercase tracking-wide">
                          💚 Cheapest Option
                        </h4>

                        <span className="text-3xl font-black text-green-200">
                          ₹{result.overall.price}
                        </span>

                      </div>

                      <div className="space-y-2.5 text-slate-300 text-sm">

                        <p className="flex justify-between">
                          <span className="text-slate-400">Airline:</span>
                          <span className="text-white font-semibold">
                            {result.overall.airline}
                          </span>
                        </p>

                        <p className="flex justify-between">
                          <span className="text-slate-400">Departs:</span>
                          <span className="text-white font-semibold">
                            {result.overall.departure}
                          </span>
                        </p>

                        <p className="flex justify-between">
                          <span className="text-slate-400">Arrives:</span>
                          <span className="text-white font-semibold">
                            {result.overall.arrival}
                          </span>
                        </p>

                      </div>

                    </div>
                  )}


                  {result.preferred && (

                    <div className="bg-gradient-to-br from-blue-500/15 to-blue-400/5 border border-blue-500/30 rounded-xl p-6 hover:border-blue-500/60 transition-all duration-300">

                      <div className="flex items-center justify-between mb-4">

                        <h4 className="text-sm font-bold text-blue-300 uppercase tracking-wide">
                          🕐 Your Preferred Time
                        </h4>

                        <span className="text-3xl font-black text-blue-200">
                          ₹{result.preferred.price}
                        </span>

                      </div>

                      <div className="space-y-2.5 text-slate-300 text-sm">

                        <p className="flex justify-between">
                          <span className="text-slate-400">Airline:</span>
                          <span className="text-white font-semibold">
                            {result.preferred.airline}
                          </span>
                        </p>

                        <p className="flex justify-between">
                          <span className="text-slate-400">Departs:</span>
                          <span className="text-white font-semibold">
                            {result.preferred.departure}
                          </span>
                        </p>

                        <p className="flex justify-between">
                          <span className="text-slate-400">Arrives:</span>
                          <span className="text-white font-semibold">
                            {result.preferred.arrival}
                          </span>
                        </p>

                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

        </div>

      </div>


      {/* Footer */}
      <div className="relative z-10 border-t border-white/10 mt-16">

        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">

          <p>✈ Powered by SerpAPI & Advanced Flight Tracking</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Documentation</a>
            <a href="#" className="hover:text-slate-300 transition-colors">GitHub</a>
            <span>v2.0</span>
          </div>

        </div>

      </div>

    </div>
  );
}