//import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit } from '@angular/core';
//import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Days } from './Wordle';
import { Valid } from './Words';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private toastr: ToastrService) {}
  title = 'Wordle';
  position = 0;
  grid = new Array<string>(5 * 6);
  keyboard = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '⌫'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '⏎'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];
  currentDay = Math.round(Math.random() * Days.length);
  row = 0;
  hidePopup = true;
  gameState = 'Error';
  validInput = 'abcdefghijklmnopqrstuvwxyz⌫⏎';
  showScare = false;
  showShareBtn = false;
  word = Days[this.currentDay];
  rowOne = '';
  rowTwo = '';
  rowThree = '';
  rowFour = '';
  rowFive = '';
  block = '';
  orangeBlock = '🟧';
  blueBlock = '🟦';
  grayBlock = '⬛';
  outputlineOne = 'Exteme Worldle day x';
  outputlineTwo = this.row + 1 + '/6';
  wordLost = '';
  ngOnInit(): void {
    document.addEventListener('keydown', (e) =>
      this.pressKey(e.key.toString()
      )
    );
    // console.log(Days[this.currentDay]);
  }

  pressKey(key: string) {
    if (this.hidePopup == false) {
      return;
    }

    if (
      !(this.validInput.includes(key) || key == 'Enter' || key == 'Backspace')
    ) {
      return;
    }

    if (key == '⏎' || key == 'Enter') {
      if (this.position == 5 + this.row * 5) {
        this.enter();
      }
    } else if (key == '⌫' || key == 'Backspace') {
      if (this.position > this.row * 5) {
        this.grid[--this.position] = ' ';
      }
      for (let i = 0; i < 5; i++) {
        let letterIndex = this.row * 5 + i;
        document
          .querySelectorAll('.grid .letter-cell')
          [letterIndex].classList.remove('red');
      }
    } else {
      if (this.position < 5 + this.row * 5) {
        this.grid[this.position++] = key;
      }
    }
  }

  enter() {
    let guess = '';
    let wordchosen = this.word;
    console.log(this.word);
    //console.log(this.word);
    let cells = document.querySelectorAll('.grid .letter-cell');
    let keys = document.querySelectorAll('.keyboard .keyboard-button');

    for (let i = 0; i < 5; i++) {
      let letterIndex = this.row * 5 + i;
      guess += this.grid[letterIndex];
    }

    if (Valid.includes(guess)) {
      for (let i = 0; i < 5; i++) {
        let letterIndex = this.row * 5 + i;
        this.color(letterIndex, wordchosen, i, cells, keys);
      }

      if (guess == wordchosen) {
        //this.hidePopup = false;
        this.showScare = true;
        this.scream();
        this.gameState = 'You Win!';
      } else {
        this.row++;
        if (this.row == 6) {
          this.hidePopup = false;
          this.gameState = 'You Lost!';
          this.wordLost =  'The word was' + ' ' + wordchosen;
        }
      }
    } else {
      for (let i = 0; i < 5; i++) {
        let letterIndex = this.row * 5 + i;
        cells[letterIndex].classList.add('red');
      }

      // Remove red error after 1 second
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
          let letterIndex = this.row * 5 + i;
          cells[letterIndex].classList.remove('red');
        }
      }, 500);
    }
  }

  private color(
    letterIndex: number,
    word: string,
    i: number,
    cells: NodeListOf<Element>,
    keys: NodeListOf<Element>
  ) {
    if (this.grid[letterIndex] == word[i]) {
      cells[letterIndex].classList.add('orange');
      this.colorKeyboard(keys, letterIndex, 'orange');
      this.addToString('orange');
    } else {
      if (word.includes(this.grid[letterIndex])) {
        cells[letterIndex].classList.add('blue');
        this.colorKeyboard(keys, letterIndex, 'blue');
        this.addToString('blue');
      } else {
        cells[letterIndex].classList.add('gray');
        this.colorKeyboard(keys, letterIndex, 'gray');
        this.addToString('gray');
      }
    }
  }

  private colorKeyboard(
    keys: NodeListOf<Element>,
    letterIndex: number,
    color: string
  ) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key.textContent == this.grid[letterIndex]) {
        key.classList.add(color);
      }
    }
  }

  newGame() {
    // console.log(this.hidePopup);
    window.location.reload();
  }
  scream() {
    let loud = new Audio();
    loud.src = 'assets/loud.mp3';
    loud.play();
    setTimeout(() => {
      this.showShareBtn = true;
    }, 2000);
  }
  share() {
    navigator.clipboard.writeText(
      'Only 21% of people can win this extreme version of Wordle. Play now to see if you have the brains to compete : https://exwordle.com '
    );
    this.toastr.success('Copied to clipboard');
  }
  addToString(color: string) {
    if (color === 'orange') {
      this.block = this.orangeBlock;
    } else if (color === 'blue') {
      this.block = this.blueBlock;
    } else if (color === 'gray') {
      this.block = this.grayBlock;
    }
    if (this.row == 0) {
      this.rowOne += this.block;
    } else if (this.row == 1) {
      this.rowTwo += this.block;
    } else if (this.row == 2) {
      this.rowThree += this.block;
    } else if (this.row == 3) {
      this.rowFour += this.block;
    } else if (this.row == 4) {
      this.rowFive += this.block;
    }
  }
  shareResult() {
    navigator.clipboard.writeText(
        this.outputlineOne +
        '\n' +
        '\t' +
        this.outputlineTwo +
        '\n' +
        this.rowOne +
        '\n' +
        this.rowTwo +
        '\n' +
        this.rowThree +
        '\n' +
        this.rowFour +
        '\n' +
        this.rowFive
    );
    this.toastr.success('Copied to clipboard');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
}
