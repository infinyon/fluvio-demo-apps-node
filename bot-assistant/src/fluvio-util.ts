import { Offset, OffsetFrom, FetchablePartitionResponse, PartitionConsumer } from "@fluvio/client";

// Collapse Batches of Records into an Array of Records
export const ToRecords = (response: FetchablePartitionResponse) => {
    let records = new Array();

    response.records.batches.forEach(batch => {
        batch.records.forEach(record => {
            records.push(record.value);
        });
    })

    return records;
};

// Generate start offset
export const FromStart = new Offset;

// Generate end offset
export const FromEnd = new Offset({ from: OffsetFrom.End, index: 0 });
