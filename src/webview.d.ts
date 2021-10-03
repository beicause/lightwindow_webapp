import {Android} from "@/common/android";

declare global {
    interface Window {
        Android?: Android
        getVersion?: () => string
    }
}
