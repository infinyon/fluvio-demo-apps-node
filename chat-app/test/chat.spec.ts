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
  @TestCase("Fetch users")
  public async fetchUsers() {
    const {
      records: { batches },
    } = await this.userConsumer.fetch({
      index: 0,
      from: OffsetFrom.Beginning,
    });

    const events: string[] = batches
      .map(({ records }) => {
        return records[0].value;
      })
      .filter((value) => {
        return value.includes("Registered");
      });

    expect.toBeEqual(
      events.length,
      2,
      `expected two user registration events, found: ${events.length}`
    );
  }

  @Test()
  @TestCase("Fetch messages")
  public async fetchMessages() {
    const {
      records: { batches },
    } = await this.chatConsumer.fetch({
      index: 0,
      from: OffsetFrom.Beginning,
    });

    const events: string[] = batches
      .map(({ records }) => {
        return records[0].value;
      })
      .filter((value) => {
        return value.includes(this.text1) || value.includes(this.text2);
      });

    expect.toBeEqual(
      events.length,
      2,
      `expected two chat events, found: ${events.length}`
    );
  }
}
