// useOneSignal.js
import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function useOneSignal() {
    useEffect(() => {
        const initOS = async () => {
            if (!window.OneSignal?.initialized) {
                await OneSignal.init({
                    appId: "ec5b905f-0206-47b3-b852-4878364dcc63",
                    notifyButton: { enable: true },
                    allowLocalhostAsSecureOrigin: true,
                });
            }
        };
        initOS();
    }, []);
}