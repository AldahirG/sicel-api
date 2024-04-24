import { prisma } from "../src/db.js";

import { roles } from "./seeders/roles.js";
import { users } from "./seeders/users.js";
import { grades } from "./seeders/grades.js";
import { careers } from "./seeders/careers.js";
import { campaigns } from "./seeders/campaigns.js";
import { followUps } from "./seeders/followUps.js";
import { contactMediums } from "./seeders/contactMediums.js";
import { asetNames } from "./seeders/asetNames.js";
import { schoolYears } from "./seeders/schoolYears.js";

async function main() {
  await roles();
  await users();
  await grades();
  await careers();
  await campaigns();
  await followUps();
  await contactMediums();
  await asetNames();
  await schoolYears();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });