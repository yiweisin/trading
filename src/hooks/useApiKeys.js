"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { encryptData, decryptData } from "@/lib/encryption";

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchApiKeys();
    }
  }, [user]);

  const fetchApiKeys = async () => {
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
    try {
      const newKey = {
        id: Date.now().toString(),
        name: keyData.name,
        encryptedApiKey: encryptData(keyData.apiKey),
        encryptedApiSecret: encryptData(keyData.apiSecret),
        testnet: keyData.testnet,
        createdAt: new Date().toISOString(),
      };

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

  return {
    apiKeys,
    loading,
    addApiKey,
    removeApiKey,
    refetch: fetchApiKeys,
  };
};
