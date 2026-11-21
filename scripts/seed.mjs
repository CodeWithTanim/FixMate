import { MongoClient } from "mongodb";
import { hashPassword } from "better-auth/crypto";

// Load .env if present
try {
  process.loadEnvFile(".env");
} catch {
  // Ignore if already loaded or missing
}

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fixmate-db";
const dbName = process.env.MONGODB_DBNAME || "fixmate-db";

const DEMO_PASSWORD_RAW = process.env.DEMO_USER_PASSWORD;
if (!DEMO_PASSWORD_RAW) {
  console.error("Error: DEMO_USER_PASSWORD environment variable is required to run the seed script.");
  console.error("Please configure DEMO_USER_PASSWORD in your private .env file before running.");
  process.exit(1);
}

async function runSeed() {
  console.log("Connecting to database at", dbName);
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const usersCol = db.collection("user");
  const accountsCol = db.collection("account");
  const servicesCol = db.collection("services");
  const bookingsCol = db.collection("bookings");

  console.log("Seeding demo user accounts...");

  const demoUsers = [
    {
      name: "Alex Customer",
      email: "customer@fixmate.dev",
      role: "customer",
      phone: "+1 (555) 123-4567",
      serviceArea: "Gulshan & Banani, Dhaka",
      bio: "Homeowner requiring reliable electronic and appliance repairs.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Rahim Ahmed",
      email: "rahim.tech@fixmate.dev",
      role: "technician",
      phone: "+1 (555) 987-6543",
      serviceArea: "Dhaka Central & Dhanmondi",
      bio: "Certified technician with 8+ years specializing in smartphone microsoldering, laptop chip-level diagnostics, and smart displays.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Sarah Khan",
      email: "sarah.appliances@fixmate.dev",
      role: "technician",
      phone: "+1 (555) 456-7890",
      serviceArea: "Gulshan, Banani & Uttara",
      bio: "HVAC and major appliance specialist. 10+ years handling inverter ACs, frost-free refrigeration, washing machines, and home electricals.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "FixMate Admin",
      email: "admin@fixmate.dev",
      role: "admin",
      phone: "+1 (555) 000-1111",
      serviceArea: "Headquarters Operations",
      bio: "Platform governance, quality moderation, and dispute mediation lead.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    },
  ];

  const userIds = {};

  const hashedPassword = await hashPassword(DEMO_PASSWORD_RAW);

  for (const u of demoUsers) {
    let existing = await usersCol.findOne({ email: u.email });
    if (!existing) {
      const doc = {
        name: u.name,
        email: u.email,
        emailVerified: true,
        image: u.image,
        role: u.role,
        phone: u.phone,
        serviceArea: u.serviceArea,
        bio: u.bio,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDemoAccount: true,
      };
      const res = await usersCol.insertOne(doc);
      userIds[u.email] = res.insertedId.toString();

      // Better auth account link (Better Auth requires userId as ObjectId and accountId as userId string)
      await accountsCol.insertOne({
        userId: res.insertedId,
        accountId: res.insertedId.toString(),
        providerId: "credential",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Created demo user: ${u.email} (${u.role})`);
    } else {
      userIds[u.email] = existing._id.toString();

      // Only update metadata if this is explicitly marked as a demo seed account
      if (!existing.isDemoAccount) {
        console.log(`Skipping non-demo user account: ${u.email}`);
        continue;
      }

      // Ensure profile metadata is maintained
      await usersCol.updateOne(
        { email: u.email },
        {
          $set: {
            role: u.role,
            phone: u.phone,
            serviceArea: u.serviceArea,
            bio: u.bio,
            image: u.image,
          },
        }
      );
      // Ensure account link exists with ObjectId userId, but DO NOT overwrite existing password
      const existingAccount = await accountsCol.findOne({
        $or: [{ userId: existing._id }, { accountId: existing._id.toString() }],
      });
      if (!existingAccount) {
        await accountsCol.insertOne({
          userId: existing._id,
          accountId: existing._id.toString(),
          providerId: "credential",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        await accountsCol.updateOne(
          { _id: existingAccount._id },
          {
            $set: {
              userId: existing._id,
              accountId: existing._id.toString(),
              providerId: "credential",
              updatedAt: new Date(),
            },
          }
        );
      }
      console.log(`Preserved existing credentials and updated metadata: ${u.email} (${u.role})`);
    }
  }

  console.log("Seeding verified catalog services across 7 categories...");

  const servicesData = [
    // Smartphone (2)
    {
      title: "iPhone & Android Screen Replacement",
      category: "Smartphone",
      description: "High-grade OEM and certified aftermarket display replacement for cracked screens, unresponsive digitizers, and discoloration. Includes free screen protector and 30-day touch guarantee.",
      image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80",
      basePrice: 45,
      estimatedDuration: "45 minutes",
      serviceMode: "Shop Drop-off",
      serviceArea: "Dhaka Central & Dhanmondi",
      technicianId: userIds["rahim.tech@fixmate.dev"],
      technicianName: "Rahim Ahmed",
      technicianEmail: "rahim.tech@fixmate.dev",
      approvalStatus: "approved",
      isAvailable: true,
    },
    {
      title: "Smartphone Battery Replacement & Charging Diagnostic",
      category: "Smartphone",
      description: "Fast on-site battery replacement for fast draining, overheating, or bulging batteries. Thorough USB-C/Lightning charging port cleaning and voltage testing.",
      image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
      basePrice: 35,
      estimatedDuration: "30 minutes",
      serviceMode: "Home Visit",
      serviceArea: "Dhaka Central & Dhanmondi",
      technicianId: userIds["rahim.tech@fixmate.dev"],
      technicianName: "Rahim Ahmed",
      technicianEmail: "rahim.tech@fixmate.dev",
      approvalStatus: "approved",
      isAvailable: true,
    },
    // Laptop & PC (2)
    {
      title: "Laptop Deep Dust Clean & Thermal Paste Repaste",
      category: "Laptop & PC",
      description: "Comprehensive disassembly and heatsink dusting, Arctic MX-6 thermal paste application on CPU/GPU, fan lubrication, and thermal stress testing to prevent thermal throttling.",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      basePrice: 40,
      estimatedDuration: "60 minutes",
      serviceMode: "Shop Drop-off",
      serviceArea: "Dhaka Central & Dhanmondi",
      technicianId: userIds["rahim.tech@fixmate.dev"],
      technicianName: "Rahim Ahmed",
      technicianEmail: "rahim.tech@fixmate.dev",
      approvalStatus: "approved",
      isAvailable: true,
    },
    {
      title: "OS Reinstallation, Virus Removal & SSD Data Migration",
      category: "Laptop & PC",
      description: "Clean installation of Windows 11/10 or macOS, driver updates, full malware cleanup, and high-speed NVMe SSD cloning without losing personal files.",
      image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80",
      basePrice: 50,
      estimatedDuration: "90 minutes",
      serviceMode: "Home Visit",
      serviceArea: "Dhaka Central & Dhanmondi",
      technicianId: userIds["rahim.tech@fixmate.dev"],
      technicianName: "Rahim Ahmed",
      technicianEmail: "rahim.tech@fixmate.dev",
      approvalStatus: "approved",
      isAvailable: true,
    },
    // AC (2)
    {
      title: "Split AC Master Jet Wash & Chemical Indoor Deep Clean",
      category: "AC",
      description: "High-pressure water pump cleaning for indoor cooling coil, blower wheel, and outdoor condenser fins. Eliminates dust buildup, unpleasant odors, and restores maximum airflow.",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
      basePrice: 45,
      estimatedDuration: "60 minutes",
      serviceMode: "Home Visit",
      serviceArea: "Gulshan, Banani & Uttara",
      technicianId: userIds["sarah.appliances@fixmate.dev"],
      technicianName: "Sarah Khan",
      technicianEmail: "sarah.appliances@fixmate.dev",
      approvalStatus: "approved",
      isAvailable: true,
    },
    {
      title: "AC Refrigerant Leak Repair & R32/R410A Gas Charging",
      category: "AC",
      description: "Electronic refrigerant leak detection, flare nut brazing, nitrogen pressure test, vacuum pump evacuation, and full factory-spec gas charging for icy cold air.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      basePrice: 65,
      estimatedDuration: "75 minutes",
      serviceMode: "Home Visit",
      serviceArea: "Gulshan, Banani & Uttara",
      technicianId: userIds["sarah.appliances@fixmate.dev"],
      technicianName: "Sarah Khan",
      technicianEmail: "sarah.appliances@fixmate.dev",
      approvalStatus: "approved",
      isAvailable: true,
    },
    // Refrigerator (2)
    {
      title: "Refrigerator No-Frost Diagnostic & Cooling Restoration",
      category: "Refrigerator",
      description: "Troubleshooting defrost timer, bi-metal thermostat, heating element, and evaporator fan motor. Clears ice dams causing water leaks and restores freezer temperature.",
      image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80",
      basePrice: 55,
      estimatedDuration: "60 minutes",
      serviceMode: "Home Visit",
      serviceArea: "Gulshan, Banani & Uttara",
      technicianId: userIds["sarah.appliances@fixmate.dev"],
      technicianName: "Sarah Khan",
      technicianEmail: "sarah.appliances@fixmate.dev",
      approvalStatus: "approved",
      isAvailable: true,
    },
    {
      title: "Inverter Refrigerator PCB Board & Compressor Repair",
      category: "Refrigerator",
      description: "Diagnostic repair of digital inverter power controller boards, starter relays, overload protectors, and R600a eco-gas charging for high-end French door models.",
      image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80",
      basePrice: 75,
      estimatedDuration: "90 minutes",
      serviceMode: "Home Visit",
      serviceArea: "Gulshan, Banani & Uttara",
      technicianId: userIds["sarah.appliances@fixmate.dev"],
      technicianName: "Sarah Khan",
      technicianEmail: "sarah.appliances@fixmate.dev",
      approvalStatus: "approved",
      isAvailable: true,
    },
    // TV (2)
    {
      title: "Smart LED/QLED TV Backlight Strip Replacement",
      category: "TV",
      description: "Restores sound-with-no-picture issues or blue tint by replacing complete factory-matched LED backlight arrays. Supported for 32-inch up to 75-inch flat screens.",
      image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80",
      basePrice: 70,
      estimatedDuration: "90 minutes",
      serviceMode: "Home Visit",
      serviceArea: "Dhaka Central & Dhanmondi",
      technicianId: userIds["rahim.tech@fixmate.dev"],
      technicianName: "Rahim Ahmed",
      technicianEmail: "rahim.tech@fixmate.dev",
      approvalStatus: "approved",
      isAvailable: true,
    },
    {
      title: "Smart TV Main Motherboard & Power Board Repair",
      category: "TV",
      description: "Component-level diagnosis for TVs that refuse to turn on, get stuck on the boot logo, or suffer from HDMI port surge damage and fluctuating power supply voltages.",
      image: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=80",
      basePrice: 60,
      estimatedDuration: "60 minutes",
      serviceMode: "Home Visit",
      serviceArea: "Dhaka Central & Dhanmondi",
      technicianId: userIds["rahim.tech@fixmate.dev"],
      technicianName: "Rahim Ahmed",
      technicianEmail: "rahim.tech@fixmate.dev",
      approvalStatus: "approved",
      isAvailable: true,
    },
    // Washing Machine (2)
    {
      title: "Automatic Washing Machine Spin & Drain Pump Repair",
      category: "Washing Machine",
      description: "Resolves drainage errors (E20/OE), clogged impeller pumps, jammed door lid locks, and faulty pressure sensors on front and top loading units.",
      image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80",
      basePrice: 50,
      estimatedDuration: "60 minutes",
      serviceMode: "Home Visit",
      serviceArea: "Gulshan, Banani & Uttara",
      technicianId: userIds["sarah.appliances@fixmate.dev"],
      technicianName: "Sarah Khan",
      technicianEmail: "sarah.appliances@fixmate.dev",
      approvalStatus: "approved",
      isAvailable: true,
    },
    {
      title: "Washing Machine Drum Bearing & Direct Drive Motor Service",
      category: "Washing Machine",
      description: "Heavy-duty overhaul for excessive loud spinning noise, drum shaking, worn-out spider arms, suspension dampers, and motor carbon brush replacement.",
      image: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800&auto=format&fit=crop&q=80",
      basePrice: 70,
      estimatedDuration: "90 minutes",
      serviceMode: "Home Visit",
      serviceArea: "Gulshan, Banani & Uttara",
      technicianId: userIds["sarah.appliances@fixmate.dev"],
      technicianName: "Sarah Khan",
      technicianEmail: "sarah.appliances@fixmate.dev",
      approvalStatus: "approved",
      isAvailable: true,
    },
    // Electrical (2)
    {
      title: "Main Distribution Board & Circuit Breaker Diagnostic",
      category: "Electrical",
      description: "Inspection of main MCB/RCCB tripping issues, busbar overheating, loose neutral wiring, and earth leakage protection testing across residential distribution boxes.",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80",
      basePrice: 40,
      estimatedDuration: "45 minutes",
      serviceMode: "Home Visit",
      serviceArea: "Gulshan, Banani & Uttara",
      technicianId: userIds["sarah.appliances@fixmate.dev"],
      technicianName: "Sarah Khan",
      technicianEmail: "sarah.appliances@fixmate.dev",
      approvalStatus: "approved",
      isAvailable: true,
    },
    {
      title: "Emergency Short Circuit Detection & Concealed Rewiring",
      category: "Electrical",
      description: "Rapid megger insulation resistance testing to locate buried wall short circuits, burnt wire replacement, switchboard repairs, and power outlet replacements.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
      basePrice: 50,
      estimatedDuration: "60 minutes",
      serviceMode: "Home Visit",
      serviceArea: "Gulshan, Banani & Uttara",
      technicianId: userIds["sarah.appliances@fixmate.dev"],
      technicianName: "Sarah Khan",
      technicianEmail: "sarah.appliances@fixmate.dev",
      approvalStatus: "approved",
      isAvailable: true,
    },
  ];

  const seededServiceIds = [];

  for (const s of servicesData) {
    const existing = await servicesCol.findOne({
      title: s.title,
      technicianEmail: s.technicianEmail,
    });

    if (!existing) {
      const doc = {
        ...s,
        isDemoSeed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const res = await servicesCol.insertOne(doc);
      seededServiceIds.push({ id: res.insertedId.toString(), title: s.title, service: doc });
      console.log(`Seeded service: ${s.title} (${s.category})`);
    } else {
      seededServiceIds.push({ id: existing._id.toString(), title: s.title, service: existing });
      await servicesCol.updateOne(
        { _id: existing._id },
        { $set: { approvalStatus: "approved", isAvailable: true } }
      );
      console.log(`Updated service: ${s.title}`);
    }
  }

  console.log("Seeding connected lifecycle repair bookings...");

  const customerId = userIds["customer@fixmate.dev"];
  const customerEmail = "customer@fixmate.dev";
  const customerName = "Alex Customer";
  const customerPhone = "+1 (555) 123-4567";
  const serviceAddress = "House 42, Road 11, Block D, Banani, Dhaka";

  // Check existing bookings for demo customer
  const existingBookingsCount = await bookingsCol.countDocuments({ customerEmail, isDemoSeed: true });

  if (existingBookingsCount === 0 && seededServiceIds.length >= 6) {
    const demoBookings = [
      // 1: Requested
      {
        service: seededServiceIds[0].service,
        status: "requested",
        paymentStatus: "unpaid",
        problemDescription: "Screen glass cracked after dropping on tiled floor. Touch sensor works but top glass has sharp fractures.",
        daysFromNow: 1,
        finalAmount: 45,
        history: [
          { status: "requested", timestamp: new Date(Date.now() - 3600000 * 2), changedBy: customerEmail, role: "customer", note: "Booking requested by customer" },
        ],
      },
      // 2: Accepted
      {
        service: seededServiceIds[2].service,
        status: "accepted",
        paymentStatus: "unpaid",
        problemDescription: "Laptop fan makes loud grinding noise and keyboard surface gets uncomfortably hot after 15 minutes of use.",
        daysFromNow: 2,
        finalAmount: 40,
        history: [
          { status: "requested", timestamp: new Date(Date.now() - 3600000 * 8), changedBy: customerEmail, role: "customer", note: "Booking requested by customer" },
          { status: "accepted", timestamp: new Date(Date.now() - 3600000 * 4), changedBy: "rahim.tech@fixmate.dev", role: "technician", note: "Technician confirmed appointment and allocated shop bench" },
        ],
      },
      // 3: In-Progress
      {
        service: seededServiceIds[4].service,
        status: "in-progress",
        paymentStatus: "unpaid",
        problemDescription: "Master bedroom 1.5 ton AC is blowing room-temperature air with weak airflow and mild mildew smell.",
        daysFromNow: 0,
        finalAmount: 45,
        history: [
          { status: "requested", timestamp: new Date(Date.now() - 3600000 * 12), changedBy: customerEmail, role: "customer", note: "Booking requested by customer" },
          { status: "accepted", timestamp: new Date(Date.now() - 3600000 * 6), changedBy: "sarah.appliances@fixmate.dev", role: "technician", note: "Technician accepted request for morning window" },
          { status: "in-progress", timestamp: new Date(Date.now() - 3600000 * 1), changedBy: "sarah.appliances@fixmate.dev", role: "technician", note: "Technician arrived on-site with pressure washer and chemical kit" },
        ],
      },
      // 4: Completed & Unpaid (Ready for customer to test Stripe payment!)
      {
        service: seededServiceIds[6].service,
        status: "completed",
        paymentStatus: "unpaid",
        problemDescription: "Fridge compartment not cooling food while freezer is freezing over excessively with thick ice accumulation.",
        daysFromNow: -1,
        finalAmount: 55,
        history: [
          { status: "requested", timestamp: new Date(Date.now() - 3600000 * 24), changedBy: customerEmail, role: "customer", note: "Booking requested by customer" },
          { status: "accepted", timestamp: new Date(Date.now() - 3600000 * 20), changedBy: "sarah.appliances@fixmate.dev", role: "technician", note: "Technician scheduled emergency cooling visit" },
          { status: "in-progress", timestamp: new Date(Date.now() - 3600000 * 18), changedBy: "sarah.appliances@fixmate.dev", role: "technician", note: "Diagnosed faulty bi-metal defrost thermostat and cleared ice blockage" },
          { status: "completed", timestamp: new Date(Date.now() - 3600000 * 2), changedBy: "sarah.appliances@fixmate.dev", role: "technician", note: "Thermostat replaced and cooling temperature tested at 4°C. Ready for customer settlement." },
        ],
      },
      // 5: Cancelled
      {
        service: seededServiceIds[8].service,
        status: "cancelled",
        paymentStatus: "unpaid",
        problemDescription: "Living room LED TV has horizontal flickering lines across upper panel during sports broadcast.",
        daysFromNow: 3,
        finalAmount: 70,
        history: [
          { status: "requested", timestamp: new Date(Date.now() - 3600000 * 30), changedBy: customerEmail, role: "customer", note: "Booking requested by customer" },
          { status: "cancelled", timestamp: new Date(Date.now() - 3600000 * 26), changedBy: customerEmail, role: "customer", note: "Customer resolved issue by reseating loose HDMI cable" },
        ],
      },
      // 6: Rejected
      {
        service: seededServiceIds[10].service,
        status: "rejected",
        paymentStatus: "unpaid",
        problemDescription: "Washing machine won't drain and shows error code OE. Suspect coin stuck in drainage filter.",
        daysFromNow: 2,
        finalAmount: 50,
        history: [
          { status: "requested", timestamp: new Date(Date.now() - 3600000 * 40), changedBy: customerEmail, role: "customer", note: "Booking requested by customer" },
          { status: "rejected", timestamp: new Date(Date.now() - 3600000 * 38), changedBy: "sarah.appliances@fixmate.dev", role: "technician", note: "Outside technician operating radius on requested date" },
        ],
      },
    ];

    for (const b of demoBookings) {
      const preferredDate = new Date();
      preferredDate.setDate(preferredDate.getDate() + b.daysFromNow);

      const bookingDoc = {
        serviceId: b.service._id.toString(),
        serviceTitle: b.service.title,
        serviceCategory: b.service.category,
        serviceImage: b.service.image,
        basePrice: b.service.basePrice,
        finalAmount: b.finalAmount,
        technicianId: b.service.technicianId,
        technicianName: b.service.technicianName,
        technicianEmail: b.service.technicianEmail,
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        serviceAddress,
        preferredDate,
        problemDescription: b.problemDescription,
        status: b.status,
        paymentStatus: b.paymentStatus,
        statusHistory: b.history,
        isDemoSeed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await bookingsCol.insertOne(bookingDoc);
      console.log(`Seeded demo booking: ${b.service.title} (${b.status})`);
    }
  } else {
    console.log(`Demo bookings already exist (${existingBookingsCount} records). Preserving existing states.`);
  }

  console.log("\nDatabase seeding completed successfully!");
  console.log("Demo user accounts verified: customer@fixmate.dev, rahim.tech@fixmate.dev, sarah.appliances@fixmate.dev, admin@fixmate.dev");

  await client.close();
}

runSeed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
