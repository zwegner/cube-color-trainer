const colors = {
  '-': '#777',
  'r': '#e00',
  'g': '#0b0',
  'b': '#00f',
  'w': '#fff',
  'y': '#ff0',
  'o': '#f92',
}

function range(min, max, step) {
  if (arguments.length === 1)
    [min, max, step] = [0, min, 1];
  if (arguments.length === 2)
    step = 1;
  let list = [];
  for (let x = min; x < max; x += step)
    list.push(x);
  return list;
}

function rand(max) {
  return ((Math.random() * max)|0) % max;
}

const COLORS = ['w', 'b', 'r', 'g', 'o', 'y'];

const x = [3, 0, 2, 5, 4, 1];
const y = [0, 2, 3, 4, 1, 5];
const z = [2, 1, 5, 3, 0, 4];
const rotate = (cube, rot) => rot.map((x) => cube[x]);
const x2 = rotate(x, x);
const xp = rotate(x2, x);
const y2 = rotate(y, y);
const yp = rotate(y2, y);
const z2 = rotate(z, z);
const zp = rotate(z2, z);
const rots = [x, x2, xp, y, y2, yp, z, z2, zp];

function scramble() {
  let colors = COLORS;
  // Do a bunch of x, y, and z rotations
  for (let i of range(20)) {
    let rot = rots[((Math.random() * 9)|0) % 9];
    colors = rot.map((x) => colors[x]);
  }
  return colors;
}

function diagram(cube, hidden) {
  const r3 = Math.sqrt(3);

  const dxs = [
    {x: 3*r3, y: 3},
    {x: 3*r3, y: -3},
    {x: 3*r3, y: 3},
  ];
  const dys = [
    {x: -3*r3, y: 3},
    {x: 0, y: 6},
    {x: 0, y: 6},
  ];
  const base = [
    {x: 0, y: -6},
    {x: 0, y: 0},
    {x: -3 * r3, y: -3},
  ];

  let faces = [];
  for (let face of range(3)) {
    let cubie = face !== hidden ? cube[face] : '-';
    let color = colors[cubie];
    let dx = dxs[face], dy = dys[face];
    let b = base[face];
    faces.push(<path d={`M ${b.x} ${b.y}
                              l ${dx.x} ${dx.y}
                              l ${dy.x} ${dy.y}
                              l ${-dx.x} ${-dx.y} z`}
      fill={color} stroke="black" stroke-width=".2" />);
  }

  let svg = <svg width="120" height="120"
      viewBox='-6.1 -6.1 12.2 12.2' fill='transparent'>
      { faces }
    </svg>;

  return svg;
}

function box(color) {
  return <svg width="48" height="48"
      viewBox='-.1 -.1 1.2 1.2' fill='transparent'>
    <path d='M 0 0 l 1 0 l 0 1 l -1 0 z'
      fill={ colors[color] } stroke="black" stroke-width=".05" />
    </svg>;
}

function Base() {
  let [cube, setCube] = React.useState(() => scramble());
  let [hidden, setHidden] = React.useState(0);
  let [guesses, setGuesses] = React.useState([]);

  let rescramble = () => {
    let old = cube, c;
    while ((c = scramble()) === old)
      ;
    setCube(c);
    setHidden(rand(3));
    setGuesses([]);
  }
  let guess = (c) => {
    if (cube[hidden] == c)
      rescramble();
    else
      setGuesses(guesses.concat([c]));
  }

  return <div id='main'>
      { diagram(cube, hidden) }
      <br/>
      <div>
        { COLORS.map((c) => {
          let guessed = guesses.indexOf(c) !== -1;
          return <button disabled={ guessed }
              onClick={ (e) => guess(c) }>
            { box(guessed ? '-' : c) }
          </button>;
        })}
      </div>
      <input type='button' onClick={ rescramble } value='Skip'/>
    </div>;
}
