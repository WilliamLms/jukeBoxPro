const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Clear existing tracks to prevent duplicates
    await prisma.track.deleteMany();

    // Seed at least 20 tracks
    const tracks = [
      { title: "Song 1", artist: "Artist A" },
      { title: "Song 2", artist: "Artist B" },
      { title: "Song 3", artist: "Artist C" },
      { title: "Song 4", artist: "Artist D" },
      { title: "Song 5", artist: "Artist E" },
      { title: "Song 6", artist: "Artist F" },
      { title: "Song 7", artist: "Artist G" },
      { title: "Song 8", artist: "Artist H" },
      { title: "Song 9", artist: "Artist I" },
      { title: "Song 10", artist: "Artist J" },
      { title: "Song 11", artist: "Artist K" },
      { title: "Song 12", artist: "Artist L" },
      { title: "Song 13", artist: "Artist M" },
      { title: "Song 14", artist: "Artist N" },
      { title: "Song 15", artist: "Artist O" },
      { title: "Song 16", artist: "Artist P" },
      { title: "Song 17", artist: "Artist Q" },
      { title: "Song 18", artist: "Artist R" },
      { title: "Song 19", artist: "Artist S" },
      { title: "Song 20", artist: "Artist T" }
    ];

    await prisma.track.createMany({ data: tracks });

    console.log("Database successfully seeded with tracks!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
