/**
 * Local question bank.
 * Each question has: id, category, question, options (array of 4), answerIndex (0-3).
 *
 * This powers the app before Supabase is connected.
 * When Supabase is live, these same fields map directly to the `questions` table.
 */

export const questions = [
  {
    id: 1,
    category: 'Championships',
    question: 'Which player has won the most NBA Finals MVP awards?',
    options: ['LeBron James', 'Kareem Abdul-Jabbar', 'Michael Jordan', 'Magic Johnson'],
    answerIndex: 2,
  },
  {
    id: 2,
    category: 'Records',
    question: 'Who holds the NBA record for most points scored in a single game?',
    options: ['Michael Jordan', 'Kobe Bryant', 'Wilt Chamberlain', 'LeBron James'],
    answerIndex: 2,
  },
  {
    id: 3,
    category: 'Teams',
    question: 'Which team has won the most NBA championships?',
    options: ['Los Angeles Lakers', 'Boston Celtics', 'Chicago Bulls', 'Golden State Warriors'],
    answerIndex: 1,
  },
  {
    id: 4,
    category: 'Players',
    question: 'Who was nicknamed "The Mailman"?',
    options: ['Charles Barkley', 'Karl Malone', 'Patrick Ewing', 'John Stockton'],
    answerIndex: 1,
  },
  {
    id: 5,
    category: 'History',
    question: 'What year was the NBA founded?',
    options: ['1941', '1946', '1952', '1960'],
    answerIndex: 1,
  },
  {
    id: 6,
    category: 'Players',
    question: 'Which player is known as "The Greek Freak"?',
    options: ['Nikola Jokic', 'Giannis Antetokounmpo', 'Luka Doncic', 'Dirk Nowitzki'],
    answerIndex: 1,
  },
  {
    id: 7,
    category: 'Records',
    question: 'Which player won the most consecutive NBA MVP awards (3)?',
    options: ['Bill Russell', 'LeBron James', 'Larry Bird', 'Wilt Chamberlain'],
    answerIndex: 3,
  },
  {
    id: 8,
    category: 'Draft',
    question: 'LeBron James was selected with which pick in the 2003 NBA Draft?',
    options: ['1st', '2nd', '3rd', '4th'],
    answerIndex: 0,
  },
  {
    id: 9,
    category: 'Teams',
    question: 'The Utah Jazz were originally based in which city?',
    options: ['Salt Lake City', 'Denver', 'New Orleans', 'Memphis'],
    answerIndex: 2,
  },
  {
    id: 10,
    category: 'Championships',
    question: 'Which team did the Chicago Bulls defeat in the 1997 NBA Finals?',
    options: ['Seattle SuperSonics', 'Utah Jazz', 'Portland Trail Blazers', 'Phoenix Suns'],
    answerIndex: 1,
  },
  {
    id: 11,
    category: 'Players',
    question: 'Who was the first player to be unanimously voted NBA MVP?',
    options: ['LeBron James', 'Stephen Curry', 'Michael Jordan', 'Shaquille O\'Neal'],
    answerIndex: 1,
  },
  {
    id: 12,
    category: 'Records',
    question: 'Which player has the most career assists in NBA history?',
    options: ['Magic Johnson', 'John Stockton', 'Steve Nash', 'Jason Kidd'],
    answerIndex: 1,
  },
  {
    id: 13,
    category: 'History',
    question: 'The ABA merged with the NBA in which year?',
    options: ['1972', '1974', '1976', '1980'],
    answerIndex: 2,
  },
  {
    id: 14,
    category: 'Teams',
    question: 'Which expansion team joined the NBA in 1988?',
    options: ['Toronto Raptors', 'Miami Heat', 'Oklahoma City Thunder', 'Memphis Grizzlies'],
    answerIndex: 1,
  },
  {
    id: 15,
    category: 'Players',
    question: 'Kobe Bryant spent his entire career with which team?',
    options: ['Chicago Bulls', 'Los Angeles Clippers', 'Los Angeles Lakers', 'Boston Celtics'],
    answerIndex: 2,
  },
]
