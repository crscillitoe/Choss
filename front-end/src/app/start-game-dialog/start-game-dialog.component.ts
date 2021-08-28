import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-start-game-dialog",
  templateUrl: "./start-game-dialog.component.html",
  styleUrls: ["./start-game-dialog.component.css"],
})
export class StartGameDialogComponent implements OnInit {
  selection: string = "random";
  inviteLink: string = "";
  constructor(
    public dialogRef: MatDialogRef<StartGameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.updateInviteLink();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  updateInviteLink() {
    this.inviteLink = this.getInviteLink(this.getOtherTeamId(this.getTeamId()));
  }

  copyInviteLink() {
    this.copyMessage(this.inviteLink);
    this.snackBar.open("Copied!", "", {
      duration: 1500,
    });
  }

  copyMessage(val: string) {
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
  }
  getInviteLink(teamId: 0 | 1): string {
    return `${this.getBaseUrl()}/play?roomId=${this.data.roomId}&gameId=${
      this.data.gamemodeId
    }&team=${teamId}`;
  }

  // Copilot generated don't touch
  getBaseUrl(): string {
    return (
      window.location.href.split("/")[0] +
      "//" +
      window.location.href.split("/")[2]
    );
  }

  getTeamId(): 0 | 1 {
    if (this.selection === "random") {
      return Math.floor(Math.random() * 2) as 0 | 1;
    }
    if (this.selection === "white") {
      return 1;
    }
    return 0;
  }

  getOtherTeamId(teamId: 0 | 1): 1 | 0 {
    return teamId === 0 ? 1 : 0;
  }
}
