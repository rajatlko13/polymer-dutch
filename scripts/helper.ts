import hre from 'hardhat';

export function daysToSeconds(days:number) : number {
    return 86400 * days;
}

// Allows to move the time of the EVM in the future
export async function timeTraveller(days: number) {
    await hre.network.provider.request({
        method: "evm_increaseTime",
        params: [daysToSeconds(days)],
    });
    await hre.network.provider.send("evm_mine");
}