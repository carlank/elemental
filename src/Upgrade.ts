export class Upgrade {
	baseCost: number = 1;
	amount: number = 0;

	constructor(readonly name: string){
	}

	get cost(): number{
		return this.baseCost * this.amount;
	}
}