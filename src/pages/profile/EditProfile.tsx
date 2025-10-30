//author: Zach Masaryk

import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "@/styles/EditProfile.module.css";

export default function EditProfile() {
  const [imageSrc, setImageSrc] = useState<string | null>(null); // state: image source

  useEffect(() => {
    const saved = localStorage.getItem("profileImagePath");
    if (saved) setImageSrc(saved);
  }, []); //loads image onto page if saved

  // sees if file exists, then reads file data
  function handleFileReading(file: File | null) {
    if (!file) {
      throw new Error("File not found");
    } else {
      const objectUrl = URL.createObjectURL(file); // access MAC photos
      setImageSrc(objectUrl); //sets image source to objectURL
      localStorage.setItem("profileImagePath", objectUrl); //locally stores image
    }
  }

  return (
    <>
      <Head>
        <title>Edit Profile | Snowcial</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.formContainer}>
          <main className={styles.main}>
            <h1 className={styles.title}>EDIT PROFILE</h1>
            <img
              src={imageSrc || ""}
              alt="Profile"
              className={styles.profileImage}
            />
            <label htmlFor="fileInput" className={styles.uploadButton}>
              Upload Profile Image
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              // CHANGE TO HANDLED MULTIPLE PHOTOS
              // passes event object, e, to function
              // accesses file, first file uploaded is [0]th
              // if no file, HFR returns null
              onChange={(e) => handleFileReading(e.target.files?.[0] || null)}
              style={{ display: "none" }} // hides input element
            />
          </main>
        </div>
      </div>
    </>
  );
}
