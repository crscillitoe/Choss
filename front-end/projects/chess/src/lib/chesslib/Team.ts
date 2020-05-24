export enum TeamOption {
  ANY = 2,
  WHITE = 1,
  BLACK = 0,
}

export class Team {
  teamOption: TeamOption;
  constructor(teamOption: TeamOption) {
    this.teamOption = teamOption;
  }

  equals(otherTeamOption: TeamOption): boolean {
    return (
      this.teamOption === TeamOption.ANY || this.teamOption === otherTeamOption
    );
  }
}
