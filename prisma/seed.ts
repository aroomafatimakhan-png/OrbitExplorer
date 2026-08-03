import { PrismaClient, CourseLevel } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const achievements = [
    { code: "first_orbit", title: "First Orbit", description: "Completed your first lesson.", icon: "orbit" },
    { code: "planet_walker", title: "Planet Walker", description: "Visited every planet in the system.", icon: "footprints" },
    { code: "cadet_graduate", title: "Cadet Graduate", description: "Finished the Beginner track.", icon: "medal" },
  ];
  for (const a of achievements) {
    await prisma.achievement.upsert({ where: { code: a.code }, update: {}, create: a });
  }

  const course = await prisma.course.upsert({
    where: { slug: "intro-to-orbital-mechanics" },
    update: {},
    create: {
      slug: "intro-to-orbital-mechanics",
      title: "Introduction to Orbital Mechanics",
      summary: "Why planets don't fall into the sun, and how satellites stay up.",
      level: CourseLevel.BEGINNER,
      topic: "Orbital Mechanics",
      order: 1,
      published: true,
      lessons: {
        create: [
          {
            title: "What Keeps a Planet in Orbit?",
            order: 1,
            content:
              "An orbit is a constant free-fall that keeps missing the ground because of sideways velocity. Gravity pulls a planet toward the Sun; the planet's sideways motion carries it past, so it keeps falling around rather than into it.",
            quiz: {
              question: "What two things combine to create a stable orbit?",
              options: ["Gravity and sideways velocity", "Heat and pressure", "Magnetism and rotation"],
              answerIndex: 0,
            },
          },
        ],
      },
    },
  });

  console.log("Seeded:", { achievements: achievements.length, course: course.slug });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
