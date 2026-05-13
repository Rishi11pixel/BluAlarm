import { useState } from "react";

export default function App() {

  const [fromCity, setFromCity] = useState("DEL");

  const [toCity, setToCity] = useState("BOM");

  const [preferredHour, setPreferredHour] = useState(13);

  const [flexibility, setFlexibility] = useState(4);

  const [travelDate, setTravelDate] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);


  const handleSubmit = async (e) => {

    e.preventDefault();

    // -----------------------------------
    // Validate Travel Date
    // -----------------------------------

    if (!travelDate) {

      alert("Please select a travel date.");

      return;
    }

    setLoading(true);

    const data = {
      from_city: fromCity,
      to_city: toCity,
      preferred_hour: Number(preferredHour),
      flexibility: Number(flexibility),
      travel_date: travelDate
    };

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/check-flights",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(data)
        }
      );

      console.log("RAW RESPONSE:", response);

      const result = await response.json();

      console.log("BACKEND RESULT:", result);

      setResult(result);

      alert("BluAlarm Activated ✈");

    } catch (error) {

      console.error("FETCH ERROR:", error);

      alert("Something went wrong.");

    } finally {

      setLoading(false);
    }
  };


  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex items-center justify-center px-6 py-10">

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-blue-500/20 blur-3xl rounded-full" />

        <div className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-cyan-400/10 blur-3xl rounded-full" />

      </div>


      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">

        {/* LEFT SECTION */}

        <div className="space-y-6">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm backdrop-blur-md">
            ✈ Smart Flight Tracking
          </div>


          <div>

            <h1 className="text-6xl font-black tracking-tight leading-none">
              Blu<span className="text-blue-400">Alarm</span>
            </h1>

            <p className="mt-6 text-slate-300 text-lg leading-relaxed max-w-xl">

              Get automatic alerts for the cheapest flights based on your preferred routes and timings.

              Built for travelers who are tired of manually refreshing flight websites like a day trader staring at stock charts.

            </p>

          </div>


          <div className="grid grid-cols-3 gap-4 pt-4">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">

              <p className="text-2xl font-bold">24/7</p>

              <p className="text-sm text-slate-400 mt-1">Monitoring</p>

            </div>


            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">

              <p className="text-2xl font-bold">Live</p>

              <p className="text-sm text-slate-400 mt-1">Price Tracking</p>

            </div>


            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">

              <p className="text-2xl font-bold">Fast</p>

              <p className="text-sm text-slate-400 mt-1">Discord Alerts</p>

            </div>

          </div>

        </div>


        {/* RIGHT SECTION */}

        <div className="relative">

          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-[40px]" />

          <div className="relative bg-white/10 border border-white/10 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl">

            <div className="mb-8">

              <h2 className="text-3xl font-bold">
                Create Flight Alert
              </h2>

              <p className="text-slate-300 mt-2">
                Configure your preferred route and timing.
              </p>

            </div>


            <form
              className="space-y-6"
              onSubmit={handleSubmit}
            >

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="text-sm text-slate-300 block mb-2">
                    From
                  </label>

                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value.toUpperCase())}
                    placeholder="DEL"
                    className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />

                </div>


                <div>

                  <label className="text-sm text-slate-300 block mb-2">
                    To
                  </label>

                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value.toUpperCase())}
                    placeholder="BOM"
                    className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />

                </div>

              </div>


              <div>

                <label className="text-sm text-slate-300 block mb-2">
                  Travel Date
                </label>

                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />

              </div>


              <div>

                <label className="text-sm text-slate-300 block mb-2">
                  Preferred Departure Hour
                </label>

                <input
                  type="number"
                  value={preferredHour}
                  onChange={(e) => setPreferredHour(e.target.value)}
                  placeholder="13"
                  className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />

              </div>


              <div>

                <label className="text-sm text-slate-300 block mb-2">
                  Flexibility Range (hours)
                </label>

                <input
                  type="number"
                  value={flexibility}
                  onChange={(e) => setFlexibility(e.target.value)}
                  placeholder="4"
                  className="w-full bg-slate-900/70 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />

              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all duration-300 font-semibold text-lg shadow-lg shadow-blue-500/30 disabled:opacity-50"
              >

                {
                  loading
                    ? "Activating BluAlarm..."
                    : "Activate BluAlarm"
                }

              </button>

            </form>


            {
              result && (

                <div className="mt-8 space-y-4">

                  <div className="border-t border-white/10 pt-6">

                    <h3 className="text-2xl font-bold mb-4">
                      Flight Results ✈
                    </h3>

                  </div>


                  {
                    result.overall && (

                      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">

                        <div className="flex items-center justify-between mb-4">

                          <h4 className="text-lg font-semibold text-green-400">
                            💸 Cheapest Overall
                          </h4>

                          <span className="text-2xl font-bold">
                            ₹{result.overall.price}
                          </span>

                        </div>

                        <div className="space-y-2 text-slate-300">

                          <p>
                            Airline:
                            <span className="text-white ml-2">
                              {result.overall.airline}
                            </span>
                          </p>

                          <p>
                            Departure:
                            <span className="text-white ml-2">
                              {result.overall.departure}
                            </span>
                          </p>

                          <p>
                            Arrival:
                            <span className="text-white ml-2">
                              {result.overall.arrival}
                            </span>
                          </p>

                        </div>

                      </div>
                    )
                  }


                  {
                    result.preferred && (

                      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5">

                        <div className="flex items-center justify-between mb-4">

                          <h4 className="text-lg font-semibold text-blue-400">
                            🕐 Preferred Time Flight
                          </h4>

                          <span className="text-2xl font-bold">
                            ₹{result.preferred.price}
                          </span>

                        </div>

                        <div className="space-y-2 text-slate-300">

                          <p>
                            Airline:
                            <span className="text-white ml-2">
                              {result.preferred.airline}
                            </span>
                          </p>

                          <p>
                            Departure:
                            <span className="text-white ml-2">
                              {result.preferred.departure}
                            </span>
                          </p>

                          <p>
                            Arrival:
                            <span className="text-white ml-2">
                              {result.preferred.arrival}
                            </span>
                          </p>

                        </div>

                      </div>
                    )
                  }

                </div>
              )
            }


            <div className="mt-8 border-t border-white/10 pt-6 flex items-center justify-between text-sm text-slate-400">

              <p>Powered by SerpApi + Discord</p>

              <p>v1.0</p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}