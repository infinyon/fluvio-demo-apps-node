import {
  TestSuite,
  BeforeAll,
  Test,
  TestCase,
  expect,
  XTest,
  Timeout,
  AfterAll,
} from "testyts";
import Fluvio, {
  FluvioAdmin,
  OffsetFrom,
  PartitionConsumer,
} from "@fluvio/client";

@TestSuite()
export class FluvioChatAppE2ETests {
  fluvio: Fluvio;
  admin: FluvioAdmin;

  userTopic = "nsc-user-events";
  chatTopic = "nsc-chat-events";

  usernamePrefix = "user";
  text1 = "TEST CHAT APP MESSAGE USER 1";
  text2 = "TEST CHAT APP MESSAGE USER 2";

  userConsumer: PartitionConsumer;
  chatConsumer: PartitionConsumer;

  @BeforeAll()
  @TestCase("Set Fluvio Client")
  async beforeAll() {
    // Set fluvio client for test suite;
    this.fluvio = await Fluvio.connect();

    expect.toBeEqual(this.fluvio instanceof Fluvio, true);

    // // Set the admin for the test suite;
    this.admin = await this.fluvio.admin();
    expect.toBeEqual(this.admin instanceof FluvioAdmin, true);

    this.userConsumer = await this.fluvio.partitionConsumer(this.userTopic, 0);
    expect.toBeEqual(this.userConsumer instanceof PartitionConsumer, true);

    this.chatConsumer = await this.fluvio.partitionConsumer(this.chatTopic, 0);
    expect.toBeEqual(this.userConsumer instanceof PartitionConsumer, true);
  }

  @Test()
  @TestCase("Find chat app topics")
  public async findTopics() {
    expect.not.toBeEqual(this.userTopic, undefined);
    const userTopic = await this.admin.findTopic(this.userTopic);
    expect.toBeEqual(userTopic.name, this.userTopic);

    expect.not.toBeEqual(this.chatTopic, undefined);
    const chatTopic = await this.admin.findTopic(this.chatTopic);
    expect.toBeEqual(chatTopic.name, this.chatTopic);
  }

  @Test()
  @TestCase("Stream registration events")
  public async checkUsers() {
    let numRegistrationEvents = 0;
    
    const test = new Promise(async(resolve, reject) => {
        await this.userConsumer.stream({
            index: 0,
            from: OffsetFrom.Beginning,
          }, async (value) => {
              if (value.includes("Registered")) {
                  numRegistrationEvents += 1;
              }

              if (numRegistrationEvents == 2) {
                  return resolve(true)
              }
          });
    })

    await test

    expect.toBeEqual(
      numRegistrationEvents,
      2,
      `expected two user registration events, found: ${numRegistrationEvents}`
    );
  }

  @XTest()
  @TestCase("Stream message events")
  public async fetchMessages() {
    let numChatEvents = 0;
    
    const test = new Promise(async (resolve, reject) => {
        await this.chatConsumer.stream({
            index: 0,
            from: OffsetFrom.Beginning,
          }, async (value) => {
              if (value.includes(this.text1) || value.includes(this.text2)) {
                  numChatEvents += 1;
              }

              if (numChatEvents == 2) {
                  return resolve(true)
              }
          });
    });

    await test

    expect.toBeEqual(
      numChatEvents,
      2,
      `expected two chat events, found: ${numChatEvents}`
    );
  }
}
