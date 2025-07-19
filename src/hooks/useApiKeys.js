"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "your-secret-key-here";

const encryptData = (data) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    return null;
  }
};

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchApiKeys = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, "userApiKeys", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const decryptedKeys = data.apiKeys.map((key) => ({
          ...key,
          apiKey: decryptData(key.encryptedApiKey),
          apiSecret: decryptData(key.encryptedApiSecret),
        }));
        setApiKeys(decryptedKeys);
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const addApiKey = async (keyData) => {
    const newKey = {
      id: Date.now().toString(),
      name: keyData.name,
      encryptedApiKey: encryptData(keyData.apiKey),
      encryptedApiSecret: encryptData(keyData.apiSecret),
      testnet: keyData.testnet,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = doc(db, "userApiKeys", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        await updateDoc(docRef, {
          apiKeys: [...currentData.apiKeys, newKey],
        });
      } else {
        await setDoc(docRef, {
          apiKeys: [newKey],
        });
      }

      await fetchApiKeys();
      return true;
    } catch (error) {
      console.error("Error adding API key:", error);
      return false;
    }
  };

  const removeApiKey = async (keyId) => {
    try {
      const docRef = doc(db, "userApiKeys", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const updatedKeys = currentData.apiKeys.filter(
          (key) => key.id !== keyId
        );
        await updateDoc(docRef, {
          apiKeys: updatedKeys,
        });
        await fetchApiKeys();
      }
      return true;
    } catch (error) {
      console.error("Error removing API key:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, [user]);

  return {
    apiKeys,
    loading,
    addApiKey,
    removeApiKey,
    fetchApiKeys,
    refetch: fetchApiKeys,
  };
};
