# Memory Game Project

## Table of Contents

* [Introduction](#introduction)
* [Contributing](#contributing)
* [Gameplay](#gameplay)

## Introduction

This code is a project for Udacity's nanodegree program "IPND". The project had some HTML and CSS styling to display a static version of the Memory Game project. The goal was to this project from a static project to an interactive one.

## Code

The code mainly consists of three files: index.html, app.css, and app.js.
The index.html file only has the basic html code for the game.
The interactive manipulation and game play is coded in the app.js file. Design of the game is style via app.css.

## Gameplay

The memory game consists of 8 pairs of memory cards. The user has to click the cards and find the matching pairs.
Every two clicks, the cards are compared:
If the cards match, they are marked green and remain solved.
If the cards don't match, they are marked green for 1.5 seconds and turned again.

When all pairs are solved, a screen indicates the number of moves, the time it took to solve the game and the number of stars gained. Also the player can restart the game if wished.
