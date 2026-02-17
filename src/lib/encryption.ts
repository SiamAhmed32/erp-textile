import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-secret-key-replace-me";

export const encryptData = (data: any): string | null => {
    try {
        if (!data) return null;
        return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    }
};

export const decryptData = (ciphertext: string | null): any => {
    try {
        if (!ciphertext) return null;
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) {
            // Fallback: try parsing as plain JSON if it wasn't encrypted
            try {
                return JSON.parse(ciphertext);
            } catch {
                return null;
            }
        }
        return JSON.parse(decryptedString);
    } catch (error) {
        // If decryption throws, try parsing as plain JSON
        try {
            if (ciphertext) return JSON.parse(ciphertext);
        } catch {
            console.error("Decryption failed:", error);
        }
        return null;
    }
};
