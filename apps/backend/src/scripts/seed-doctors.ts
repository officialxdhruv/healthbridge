import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { Doctor } from "@/models/doctorModel";

// CLOUDINARY_URL=cloudinary://357729154999887:1Xpw64ON8dv9vFfmqDV-12NU4SI@dbgmstyza

const ADMIN_EMAIL = "dhruv@gmail.com";
const ADMIN_PASSWORD = "admin1234";

// cloudinary.config({
//   cloud_name: "dbgmstyza",
//   api_key: "357729154999887",
//   api_secret: "1Xpw64ON8dv9vFfmqDV-12NU4SI",
//   secure: true,
// });

cloudinary.config({
  cloud_name: "dpi8rto1s",
  api_key: "562115492616729",
  api_secret: "UQBENGbj6EBcnTVEgLug0kRdzDY",
  secure: true,
});

// immediately verify
const cfg = cloudinary.config();
console.log("api_key:", cfg.api_key);
console.log("api_secret:", cfg.api_secret ? "present" : "MISSING");
console.log("cloud_name:", cfg.cloud_name);

const doctors = [
  {
    name: "Dr. Rajesh Sharma",
    email: "rajesh.sharma1@gmail.com",
    password: "Doctor@123",
    speciality: "General physician",
    degree: "MBBS, MD",
    experience: "10 Years",
    fees: 700,
    address1: "MG Road",
    address2: "New Delhi",
    about:
      "Experienced general physician specializing in preventive healthcare and chronic disease management.",
  },
  {
    name: "Dr. Priya Mehta",
    email: "priya.mehta1@gmail.com",
    password: "Doctor@123",
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    fees: 500,
    address1: "Satellite Road",
    address2: "Ahmedabad",
    about:
      "Dedicated physician focused on family healthcare and patient wellness.",
  },
  {
    name: "Dr. Anjali Kapoor",
    email: "anjali.kapoor1@gmail.com",
    password: "Doctor@123",
    speciality: "Gynecologist",
    degree: "MBBS, MS Gynecology",
    experience: "8 Years",
    fees: 900,
    address1: "Civil Lines",
    address2: "Jaipur",
    about: "Expert gynecologist providing maternity and women wellness care.",
  },
  {
    name: "Dr. Neha Verma",
    email: "neha.verma1@gmail.com",
    password: "Doctor@123",
    speciality: "Gynecologist",
    degree: "MBBS, DGO",
    experience: "5 Years",
    fees: 850,
    address1: "Sector 22",
    address2: "Chandigarh",
    about:
      "Specialist in pregnancy care, infertility treatment, and women's health.",
  },
  {
    name: "Dr. Vikram Singh",
    email: "vikram.singh1@gmail.com",
    password: "Doctor@123",
    speciality: "Dermatologist",
    degree: "MBBS, MD Dermatology",
    experience: "7 Years",
    fees: 1000,
    address1: "Park Street",
    address2: "Kolkata",
    about:
      "Dermatologist experienced in skin treatments, acne care, and cosmetic procedures.",
  },
  {
    name: "Dr. Sneha Iyer",
    email: "sneha.iyer1@gmail.com",
    password: "Doctor@123",
    speciality: "Dermatologist",
    degree: "MBBS, DDVL",
    experience: "3 Years",
    fees: 750,
    address1: "Anna Nagar",
    address2: "Chennai",
    about:
      "Skin specialist helping patients with allergies, pigmentation, and hair issues.",
  },
  {
    name: "Dr. Arjun Patel",
    email: "arjun.patel1@gmail.com",
    password: "Doctor@123",
    speciality: "Pediatricians",
    degree: "MBBS, MD Pediatrics",
    experience: "6 Years",
    fees: 650,
    address1: "Navrangpura",
    address2: "Ahmedabad",
    about:
      "Pediatrician focused on child nutrition, growth, and vaccination care.",
  },
  {
    name: "Dr. Kavita Nair",
    email: "kavita.nair1@gmail.com",
    password: "Doctor@123",
    speciality: "Pediatricians",
    degree: "MBBS, DCH",
    experience: "2 Years",
    fees: 550,
    address1: "Marine Drive",
    address2: "Mumbai",
    about:
      "Friendly child specialist providing healthcare for infants and children.",
  },
  {
    name: "Dr. Rohit Malhotra",
    email: "rohit.malhotra1@gmail.com",
    password: "Doctor@123",
    speciality: "Neurologist",
    degree: "MBBS, DM Neurology",
    experience: "9 Years",
    fees: 1400,
    address1: "Banjara Hills",
    address2: "Hyderabad",
    about:
      "Neurologist treating migraine, epilepsy, and nervous system disorders.",
  },
  {
    name: "Dr. Meera Joshi",
    email: "meera.joshi1@gmail.com",
    password: "Doctor@123",
    speciality: "Neurologist",
    degree: "MBBS, MD Neurology",
    experience: "4 Years",
    fees: 1200,
    address1: "FC Road",
    address2: "Pune",
    about:
      "Specialist in neurological disorders with a patient-centered treatment approach.",
  },
  {
    name: "Dr. Sanjay Kulkarni",
    email: "sanjay.kulkarni1@gmail.com",
    password: "Doctor@123",
    speciality: "Gastroenterologist",
    degree: "MBBS, DM Gastroenterology",
    experience: "10 Years",
    fees: 1300,
    address1: "Residency Road",
    address2: "Bengaluru",
    about:
      "Expert in digestive disorders, liver diseases, and endoscopy procedures.",
  },
  {
    name: "Dr. Pooja Reddy",
    email: "pooja.reddy1@gmail.com",
    password: "Doctor@123",
    speciality: "Gastroenterologist",
    degree: "MBBS, MD Gastroenterology",
    experience: "5 Years",
    fees: 1100,
    address1: "Jubilee Hills",
    address2: "Hyderabad",
    about:
      "Digestive health specialist treating stomach, liver, and intestinal conditions.",
  },
];

const images = [
  "./scripts/images/doctor1.png",
  "./scripts/images/doctor2.png",
  "./scripts/images/doctor3.png",
  "./scripts/images/doctor4.png",
  "./scripts/images/doctor5.png",
  "./scripts/images/doctor6.png",
  "./scripts/images/doctor7.png",
  "./scripts/images/doctor8.png",
  "./scripts/images/doctor9.png",
  "./scripts/images/doctor10.png",
  "./scripts/images/doctor11.png",
  "./scripts/images/doctor12.png",
];

async function seed() {
  await mongoose.connect(
    "mongodb+srv://officialxdhruv:K6cdVQ3wTECqolMC@cluster0.qdkmrli.mongodb.net/healthbridge", // ✅ add database name
  );

  if (images.length < doctors.length) {
    console.warn(
      `⚠️  Only ${images.length} images for ${doctors.length} doctors — some will reuse images`,
    );
  }

  for (let i = 1; i < doctors.length; i++) {
    const doctor = doctors[i]!;
    const imageFile = images[i % images.length]!;

    console.log(`📤 Uploading image for: ${doctor.name} (${imageFile})`);

    // Upload image directly from server to Cloudinary
    // ✅ Use regular signed upload
    console.log(imageFile);

    const uploadResult = (await fetch(
      `https://api.cloudinary.com/v1_1/dbgmstyza/image/upload`,
      {
        method: "POST",
        body: (() => {
          const data = new FormData();
          data.append("file", Bun.file(imageFile));
          data.append("upload_preset", "healthbridge_doctors");
          return data;
        })(),
      },
    ).then((res) => res.json())) as { secure_url: string };

    const image = uploadResult.secure_url;

    // Reuse your existing password‑hashing logic if needed
    const { genSalt, hash } = await import("bcrypt");
    const salt = await genSalt(10);
    const hashedPassword = await hash(doctor.password, salt);

    const newDoctor = new Doctor({
      name: doctor.name,
      email: doctor.email,
      image,
      password: hashedPassword,
      speciality: doctor.speciality,
      degree: doctor.degree,
      experience: doctor.experience,
      fees: doctor.fees,
      address: {
        line1: doctor.address1,
        line2: doctor.address2,
      },
      about: doctor.about,
    });

    await newDoctor.save();
    console.log(`✅ Doctor created: ${doctor.name}`);
  }

  console.log("🎉 Seeding complete!");
}

seed().catch((err) => {
  console.error(err);
  console.error("❌ Seeding failed:", err.message);
  process.exit(1);
});
