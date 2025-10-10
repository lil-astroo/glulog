import React, { useEffect, useState } from "react";
import WidgetMd from "../components/WidgetMd";
import WidgetLg from "../components/WidgetLg";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import { Heat } from "@alptugidin/react-circular-progress-bar";
import { toast } from "react-toastify";
import { FilePlus2, HeartPulse } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

//تنظیمات Tooltip نمودار
const tooltipStyle = {
    backgroundColor: "hsl(208,18%,9%)",
    border: "1px solid hsl(208,13%,28%)",
    borderRadius: "10px",
    color: "hsl(208,97%,95%)",
    fontFamily: "IranSans",
};

if (!crypto.randomUUID) {
    crypto.randomUUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

export default function Home() {

    const [loading, setLoading] = useState(true); // اول true باشه چون هنوز دیتا نیومده
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true); // شروع لودینگ
            const response = await fetch('https://api.backendless.com/F709728E-F527-4D4C-B3DA-C415F4581F77/D270E61A-C6A4-4589-88B4-4AF48BF29ABB/data/glucoseData?sortBy=created%20desc');
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error(error);
            toast.error("ارتباط با سرور برقرار نشد!");
        } finally {
            setLoading(false); // لودینگ تموم شد
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getAvgGlucose = () => {
        if (!data || data.length === 0) return 0;

        const total = data.reduce((sum, entry) => {
            const value = Number(entry.glucoseLevel); // فیلد درست
            return sum + (isNaN(value) ? 0 : value);
        }, 0);

        const avg = total / data.length;
        return Math.round(avg);
    };

    const getLastRecord = () => {
        if (!data || data.length === 0) return null;
        return data[0]; // آخرین رکورد
    };
    const lastRecord = getLastRecord();
    const lastRecordRange = lastRecord ? (lastRecord.glucoseLevel < 80 ? 'low' : lastRecord.glucoseLevel > 180 ? 'high' : 'normal') : null;

    const getWeeklyData = () => {
        if (!data || data.length === 0) {
            console.warn("⚠️ هیچ دیتایی وجود نداره!");
            return [];
        }

        const daysOfWeek = ["یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];
        const today = new Date();
        const weeklyData = [];

        console.log("📅 امروز:", today.toISOString());

        for (let i = 6; i >= 0; i--) {
            const day = new Date(today);
            day.setDate(today.getDate() - i);

            const dayName = daysOfWeek[day.getDay()];

            // ساخت رشته تاریخ به صورت YYYY-MM-DD با زمان محلی
            const dayStr = `${day.getFullYear()}-${(day.getMonth() + 1).toString().padStart(2, '0')}-${day.getDate().toString().padStart(2, '0')}`;

            console.log("🔹 بررسی روز:", dayName, "-", dayStr);

            // فیلتر رکوردهای مربوط به اون روز
            const dayEntries = data.filter(entry => {
                if (!entry.created) {
                    console.warn("🚫 رکورد بدون created:", entry);
                    return false;
                }

                const entryDateObj = new Date(entry.created);
                const entryDayStr = `${entryDateObj.getFullYear()}-${(entryDateObj.getMonth() + 1).toString().padStart(2, '0')}-${entryDateObj.getDate().toString().padStart(2, '0')}`;

                const match = entryDayStr === dayStr;

                if (match) {
                    console.log(`✅ رکورد مطابق با ${dayName}:`, entry.glucoseLevel, entryDayStr);
                } else {
                    console.log(`❌ رکورد ${entryDayStr} != ${dayStr}`);
                }

                return match;
            });

            const avgGlucose = dayEntries.length > 0
                ? Math.round(dayEntries.reduce((sum, entry) => sum + Number(entry.glucoseLevel || 0), 0) / dayEntries.length)
                : 0;

            console.log(`📊 میانگین ${dayName}:`, avgGlucose, "از", dayEntries.length, "رکورد");

            weeklyData.push({ day: dayName, glucose: avgGlucose });
        }

        console.log("📈 نتیجه نهایی weeklyData:", weeklyData);
        return weeklyData;
    };

    //تنظیمات Heat widget
    const heatConfig = {
        progress: getAvgGlucose(),
        range: { from: 0, to: 600 },
        sign: { value: " mg/dl", position: "end" },
        text: "میانگین قند خون",
        sx: {
            barWidth: 5,
            bgColor: "#dadada",
            shape: "half",
            valueSize: 10,
            textSize: 8,
            valueFamily: "IranSans",
            textFamily: "IranSans",
            loadingTime: 1000,
            strokeLinecap: "round",
            valueAnimation: true,
            intersectionEnabled: true,
        },
    };

    const handleModalClose = () => setIsModalOpen(false);

    if (loading) {
        return (
            <div className="loader">
                <Loading />
            </div>
        );
    }

    return (
        <div className="home">
            <WidgetMd>
                <div className="chart">
                    {data && data.length > 0 ? (
                        <Heat {...heatConfig} />
                    ) : (
                        <div className="no-data">هیچ داده‌ای برای نمایش وجود ندارد</div>
                    )}
                </div>
            </WidgetMd>

            <WidgetLg>
                <div className="widget__container">
                    <div className="widget__header">
                        <h2 className="widget__title">:آخرین ثبت</h2>
                    </div>
                    <div className="widget__body">
                        <HeartPulse className="lastsubmit__icon animate__animated animate__heartBeat" />
                        <div className="lastsubmit__info">
                            <span className={`lastsubmit__value ${lastRecordRange}`}>{lastRecord?.glucoseLevel || 0} mg/dl</span>
                            <span className={`lastsubmit__time`}>
                                در&nbsp;
                                {lastRecord?.date}&nbsp;
                                &nbsp;
                                {lastRecord?.time || '--:--'}
                            </span>
                        </div>
                    </div>
                </div>
            </WidgetLg>

            <button className="add-entry-button" onClick={() => setIsModalOpen(true)}>
                <FilePlus2 />
                ثبت قند خون جدید
            </button>

            <WidgetLg>
                <div className="widget__container graph__widget">
                    <div className="widget__header">
                        <h2 className="widget__title">:نمودار هفته اخیر</h2>
                    </div>
                    <div className="widget__body graph">
                        <ResponsiveContainer width="100%" height={170}>
                            <LineChart data={getWeeklyData()} margin={{ right: 25, left: -30, bottom: -20, top: 10 }}>
                                <XAxis
                                    dataKey="day"
                                    stroke="hsl(208,14%,70%)"
                                    fontSize={10}
                                    fontFamily="IranSans"
                                    tickLine={false}
                                    angle={-45}
                                    textAnchor="end"
                                    interval={0}
                                    height={60}       // فضای عمودی برای برچسب‌ها
                                />
                                <YAxis
                                    stroke="hsl(208,14%,70%)"
                                    fontSize={12}
                                    fontFamily="IranSans"
                                    tickLine={false}
                                    domain={[80, 140]}
                                />
                                <Tooltip
                                    contentStyle={tooltipStyle}
                                    cursor={{
                                        stroke: "hsl(207,76%,70%)",
                                        strokeWidth: 1,
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="glucose"
                                    stroke="hsl(207,76%,70%)"
                                    strokeWidth={3}
                                    dot={{ r: 5, fill: "hsl(207,76%,70%)" }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </WidgetLg>
            {isModalOpen && <Modal onClose={handleModalClose} reload={fetchData} />}
        </div>
    );
}