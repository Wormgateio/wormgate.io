import { makeAutoObservable } from "mobx";

class RefuelState {
    loading: boolean = false;

    balance: number | null = 0;
    transferTime: number = 0;
    lzFee: number = 0;
    refuelFee: number = 0;
    refuelOutput: string = '';

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