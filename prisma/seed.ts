import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Account {
  sim: string;
  name: string;
  airtime: string;
}

interface Airtime {
  serial: number;
  code: string;
  value: string;
}

function createAccount(): Account {
  return {
    sim: faker.phone.number('080 ### ###'),
    name: faker.person.fullName(),
    airtime: faker.finance.amount(0, 700, 2),
  };
}

function createAirtime(): Airtime {
  return {
    serial: +faker.phone.number('727######'),
    code: faker.string.numeric({ allowLeadingZeros: false, length: 12 }),
    value: faker.helpers.arrayElement(['50', '100', '200', '500']),
  };
}

async function seedAccount() {
  const accounts = faker.helpers.multiple(createAccount, { count: 10 });

  try {
    for (const item of accounts) {
      const account = await prisma.account.create({
        data: {
          sim: item.sim,
          name: item.name,
          airtime: item.airtime,
        },
      });

      console.log(
        `Created Account: ${account.name} ${account.sim} ${account.airtime}`,
      );
    }
  } catch (error) {
    console.error(error);
  }
}

async function seedAirtime() {
  const airtimes = faker.helpers.multiple(createAirtime, { count: 100 });

  try {
    for (const item of airtimes) {
      const result = await prisma.airtime.create({
        data: {
          serial: item.serial,
          code: item.code,
          value: item.value,
        },
      });

      console.log(
        `Generated Airtime: ${result.serial} ${result.code} ${result.value}`,
      );
    }
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  seedAirtime();
  seedAccount();
}

main();
