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

  /**
   * Returns the opposite team
   */
  opposite(): TeamOption {
    return this.equals(TeamOption.WHITE) ? TeamOption.BLACK : TeamOption.WHITE;
  }

  equals(otherTeamOption: TeamOption): boolean {
    return (
      this.teamOption === TeamOption.ANY || this.teamOption === otherTeamOption
    );
  }

  direction(): number {
    return this.teamOption === TeamOption.WHITE ? 1 : -1;
  }
}
