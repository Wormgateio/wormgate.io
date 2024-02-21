import { makeAutoObservable } from "mobx";

class RefuelState {
    loading: boolean = false;

    balance: string | null;
    transferTime: string;
    lzFee: string;
    refuelFee: string;
    refuelOutput: string;

    constructor() {
        makeAutoObservable(this, undefined, {
            autoBind: true
        });
    }

    async updateInfo() {
        this.loading = true;


        this.loading = false;
    }

    async updateFeeAmount() {

    }
}