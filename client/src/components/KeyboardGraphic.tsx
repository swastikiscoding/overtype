const KeyboardGraphic = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 744 284" >
    <defs>
      <linearGradient id="brandGrad" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#C850F2" />
        <stop offset="100%" stopColor="#5E29FF" />
      </linearGradient>
    </defs>
    <style>
      {
        ".key{fill:#251c33;transition:fill .2s ease}.key:hover{fill:#36284a;cursor:pointer}.accent{fill:url(#brandGrad);transition:opacity .2s ease}.accent:hover{opacity:.85;cursor:pointer}.wasd{fill:#2c1f40;stroke:url(#brandGrad);stroke-width:1.5px;transition:fill .2s ease}.wasd:hover{fill:#3a2559;cursor:pointer}.lbl,.lbl-mod{font-family:ui-sans-serif,system-ui,sans-serif;font-weight:600;text-anchor:middle}.lbl{fill:#e2d8f0;font-size:12px;pointer-events:none}.lbl-mod{fill:#a99cb8;font-size:10px;letter-spacing:.5px}.arrow,.lbl-acc,.lbl-mod{pointer-events:none}.lbl-acc{font-family:ui-sans-serif,system-ui,sans-serif;font-weight:700;fill:#fff;font-size:11px;letter-spacing:1px;text-anchor:middle}.arrow{stroke:#e2d8f0;stroke-width:2px;fill:none;stroke-linecap:round;stroke-linejoin:round}"
      }
    </style>
    <rect
      width={744}
      height={284}
      fill="#130e1b"
      stroke="url(#brandGrad)"
      strokeWidth={2}
      rx={16}
    />
    <rect width={716} height={256} x={14} y={14} fill="#1a1425" rx={8} />
    <rect
      width={684}
      height={2}
      x={30}
      y={19}
      fill="url(#brandGrad)"
      opacity={0.6}
      rx={1}
    />
    <g transform="translate(0 30)">
      <rect width={40} height={40} x={30} className="accent" rx={6} />
      <text x={50} y={24} className="lbl-acc">
        {"ESC"}
      </text>
      <rect width={40} height={40} x={76} className="key" rx={6} />
      <text x={96} y={24} className="lbl">
        {"1"}
      </text>
      <rect width={40} height={40} x={122} className="key" rx={6} />
      <text x={142} y={24} className="lbl">
        {"2"}
      </text>
      <rect width={40} height={40} x={168} className="key" rx={6} />
      <text x={188} y={24} className="lbl">
        {"3"}
      </text>
      <rect width={40} height={40} x={214} className="key" rx={6} />
      <text x={234} y={24} className="lbl">
        {"4"}
      </text>
      <rect width={40} height={40} x={260} className="key" rx={6} />
      <text x={280} y={24} className="lbl">
        {"5"}
      </text>
      <rect width={40} height={40} x={306} className="key" rx={6} />
      <text x={326} y={24} className="lbl">
        {"6"}
      </text>
      <rect width={40} height={40} x={352} className="key" rx={6} />
      <text x={372} y={24} className="lbl">
        {"7"}
      </text>
      <rect width={40} height={40} x={398} className="key" rx={6} />
      <text x={418} y={24} className="lbl">
        {"8"}
      </text>
      <rect width={40} height={40} x={444} className="key" rx={6} />
      <text x={464} y={24} className="lbl">
        {"9"}
      </text>
      <rect width={40} height={40} x={490} className="key" rx={6} />
      <text x={510} y={24} className="lbl">
        {"0"}
      </text>
      <rect width={40} height={40} x={536} className="key" rx={6} />
      <text x={556} y={24} className="lbl">
        {"-"}
      </text>
      <rect width={40} height={40} x={582} className="key" rx={6} />
      <text x={602} y={24} className="lbl">
        {"="}
      </text>
      <rect width={86} height={40} x={628} className="key" rx={6} />
      <text x={671} y={24} className="lbl-mod">
        {"BACKSPACE"}
      </text>
    </g>
    <g transform="translate(0 76)">
      <rect width={63} height={40} x={30} className="key" rx={6} />
      <text x={61.5} y={24} className="lbl-mod">
        {"TAB"}
      </text>
      <rect width={40} height={40} x={99} className="key" rx={6} />
      <text x={119} y={24} className="lbl">
        {"Q"}
      </text>
      <rect width={40} height={40} x={145} className="wasd" rx={6} />
      <text x={165} y={24} className="lbl">
        {"W"}
      </text>
      <rect width={40} height={40} x={191} className="key" rx={6} />
      <text x={211} y={24} className="lbl">
        {"E"}
      </text>
      <rect width={40} height={40} x={237} className="key" rx={6} />
      <text x={257} y={24} className="lbl">
        {"R"}
      </text>
      <rect width={40} height={40} x={283} className="key" rx={6} />
      <text x={303} y={24} className="lbl">
        {"T"}
      </text>
      <rect width={40} height={40} x={329} className="key" rx={6} />
      <text x={349} y={24} className="lbl">
        {"Y"}
      </text>
      <rect width={40} height={40} x={375} className="key" rx={6} />
      <text x={395} y={24} className="lbl">
        {"U"}
      </text>
      <rect width={40} height={40} x={421} className="key" rx={6} />
      <text x={441} y={24} className="lbl">
        {"I"}
      </text>
      <rect width={40} height={40} x={467} className="key" rx={6} />
      <text x={487} y={24} className="lbl">
        {"O"}
      </text>
      <rect width={40} height={40} x={513} className="key" rx={6} />
      <text x={533} y={24} className="lbl">
        {"P"}
      </text>
      <rect width={40} height={40} x={559} className="key" rx={6} />
      <text x={579} y={24} className="lbl">
        {"["}
      </text>
      <rect width={40} height={40} x={605} className="key" rx={6} />
      <text x={625} y={24} className="lbl">
        {"]"}
      </text>
      <rect width={63} height={40} x={651} className="key" rx={6} />
      <text x={682.5} y={24} className="lbl">
        {"\\"}
      </text>
    </g>
    <g transform="translate(0 122)">
      <rect width={78} height={40} x={30} className="key" rx={6} />
      <text x={69} y={24} className="lbl-mod">
        {"CAPS"}
      </text>
      <rect width={40} height={40} x={114} className="wasd" rx={6} />
      <text x={134} y={24} className="lbl">
        {"A"}
      </text>
      <rect width={40} height={40} x={160} className="wasd" rx={6} />
      <text x={180} y={24} className="lbl">
        {"S"}
      </text>
      <rect width={40} height={40} x={206} className="wasd" rx={6} />
      <text x={226} y={24} className="lbl">
        {"D"}
      </text>
      <rect width={40} height={40} x={252} className="key" rx={6} />
      <text x={272} y={24} className="lbl">
        {"F"}
      </text>
      <rect width={40} height={40} x={298} className="key" rx={6} />
      <text x={318} y={24} className="lbl">
        {"G"}
      </text>
      <rect width={40} height={40} x={344} className="key" rx={6} />
      <text x={364} y={24} className="lbl">
        {"H"}
      </text>
      <rect width={40} height={40} x={390} className="key" rx={6} />
      <text x={410} y={24} className="lbl">
        {"J"}
      </text>
      <rect width={40} height={40} x={436} className="key" rx={6} />
      <text x={456} y={24} className="lbl">
        {"K"}
      </text>
      <rect width={40} height={40} x={482} className="key" rx={6} />
      <text x={502} y={24} className="lbl">
        {"L"}
      </text>
      <rect width={40} height={40} x={528} className="key" rx={6} />
      <text x={548} y={24} className="lbl">
        {";"}
      </text>
      <rect width={40} height={40} x={574} className="key" rx={6} />
      <text x={594} y={24} className="lbl">
        {"'"}
      </text>
      <rect width={94} height={40} x={620} className="accent" rx={6} />
      <text x={667} y={24} className="lbl-acc">
        {"ENTER"}
      </text>
    </g>
    <g transform="translate(0 168)">
      <rect width={94} height={40} x={30} className="key" rx={6} />
      <text x={77} y={24} className="lbl-mod">
        {"SHIFT"}
      </text>
      <rect width={40} height={40} x={130} className="key" rx={6} />
      <text x={150} y={24} className="lbl">
        {"Z"}
      </text>
      <rect width={40} height={40} x={176} className="key" rx={6} />
      <text x={196} y={24} className="lbl">
        {"X"}
      </text>
      <rect width={40} height={40} x={222} className="key" rx={6} />
      <text x={242} y={24} className="lbl">
        {"C"}
      </text>
      <rect width={40} height={40} x={268} className="key" rx={6} />
      <text x={288} y={24} className="lbl">
        {"V"}
      </text>
      <rect width={40} height={40} x={314} className="key" rx={6} />
      <text x={334} y={24} className="lbl">
        {"B"}
      </text>
      <rect width={40} height={40} x={360} className="key" rx={6} />
      <text x={380} y={24} className="lbl">
        {"N"}
      </text>
      <rect width={40} height={40} x={406} className="key" rx={6} />
      <text x={426} y={24} className="lbl">
        {"M"}
      </text>
      <rect width={40} height={40} x={452} className="key" rx={6} />
      <text x={472} y={24} className="lbl">
        {","}
      </text>
      <rect width={40} height={40} x={498} className="key" rx={6} />
      <text x={518} y={24} className="lbl">
        {"."}
      </text>
      <rect width={40} height={40} x={544} className="key" rx={6} />
      <text x={564} y={24} className="lbl">
        {"/"}
      </text>
      <rect width={78} height={40} x={590} className="key" rx={6} />
      <text x={629} y={24} className="lbl-mod">
        {"SHIFT"}
      </text>
      <rect width={40} height={40} x={674} className="key" rx={6} />
      <path d="m689 22 5-5 5 5" className="arrow" />
    </g>
    <g transform="translate(0 214)">
      <rect width={51} height={40} x={30} className="key" rx={6} />
      <text x={55.5} y={24} className="lbl-mod">
        {"CTRL"}
      </text>
      <rect width={52} height={40} x={87} className="key" rx={6} />
      <text x={113} y={24} className="lbl-mod">
        {"WIN"}
      </text>
      <rect width={51} height={40} x={145} className="key" rx={6} />
      <text x={170.5} y={24} className="lbl-mod">
        {"ALT"}
      </text>
      <rect width={282} height={40} x={202} className="key" rx={6} />
      <rect
        width={40}
        height={3}
        x={323}
        y={23}
        fill="#3a2a52"
        pointerEvents="none"
        rx={1.5}
      />
      <rect width={40} height={40} x={490} className="key" rx={6} />
      <text x={510} y={24} className="lbl-mod">
        {"ALT"}
      </text>
      <rect width={40} height={40} x={536} className="key" rx={6} />
      <text x={556} y={24} className="lbl-mod">
        {"FN"}
      </text>
      <rect width={40} height={40} x={582} className="key" rx={6} />
      <path d="m605 17-5 5 5 5" className="arrow" />
      <rect width={40} height={40} x={628} className="key" rx={6} />
      <path d="m643 19 5 5 5-5" className="arrow" />
      <rect width={40} height={40} x={674} className="key" rx={6} />
      <path d="m691 17 5 5-5 5" className="arrow" />
    </g>
  </svg>
)
export default KeyboardGraphic
