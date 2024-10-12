import React from 'react';
import Modal from '../Components/Modal';

export const QuestionMarkInstructionsModal = ({ isOpen, onClose }) => (
   <Modal isOpen={isOpen} onClose={onClose}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Calculator Usage Instructions</h2>
      <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
         <div style={{ border: '1px solid var(--primary-color)', padding: '1rem', borderRadius: 'var(--button-border-radius)' }}>
            <h3 style={{ textAlign: 'center' }}>Basic Usage</h3>
            <p>
               This calculator functions as a standard text-based calculator.
               Pay special attention to the <button style={{ padding: '0.15rem 1rem', marginRight: '1rem' }}>(</button><button style={{ padding: '0.15rem 1rem' }}>)</button> buttons,
               as <strong style={{ color: 'orangered' }}>an unclosed pair will prevent the calculation from being performed</strong>.
            </p>
         </div>
         <div style={{ border: '1px solid var(--primary-color)', padding: '1rem', borderRadius: 'var(--button-border-radius)' }}>
            <h3 style={{ textAlign: 'center' }}>Advanced Usage</h3>
            <p>
               Pressing the <button style={{ padding: '0.15rem 1rem' }}>Functions</button> button reveals an additional keyboard.
            </p>
            <p>
               Trigonometric functions use <span>radians</span> by default in their calculations,
               but you can use the <button style={{ padding: '0.15rem 1rem' }}>deg</button>, <button style={{ padding: '0.15rem 1rem' }}>rad</button>, <button style={{ padding: '0.15rem 1rem' }}>grad</button> buttons for automatic conversion.
            </p>
            <p>
               The calculator can convert and operate with various <span>physical quantities</span>. Here's a comprehensive list of supported units:
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
               <thead>
                  <tr style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                     <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Base</th>
                     <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Units</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Length</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>meter (m), inch (in), foot (ft), yard (yd), mile (mi), link (li), rod (rd), chain (ch), angstrom, mil</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Surface area</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>m2, sqin, sqft, sqyd, sqmi, sqrd, sqch, sqmil, acre, hectare</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Volume</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>m3, litre (l, L, lt, liter), cc, cuin, cuft, cuyd, teaspoon, tablespoon</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Liquid volume</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>minim, fluiddram (fldr), fluidounce (floz), gill (gi), cup (cp), pint (pt), quart (qt), gallon (gal), beerbarrel (bbl), oilbarrel (obl), hogshead, drop (gtt)</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Angles</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>rad (radian), deg (degree), grad (gradian), cycle, arcsec (arcsecond), arcmin (arcminute)</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Time</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>second (s, secs, seconds), minute (min, mins, minutes), hour (h, hr, hrs, hours), day (days), week (weeks), month (months), year (years), decade (decades), century (centuries), millennium (millennia)</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Frequency</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>hertz (Hz)</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Mass</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>gram(g), tonne, ton, grain (gr), dram (dr), ounce (oz), poundmass (lbm, lb, lbs), hundredweight (cwt), stick, stone</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Temperature</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>kelvin (K), celsius (degC), fahrenheit (degF), rankine (degR)</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Amount of substance</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>mole (mol)</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Luminous intensity</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>candela (cd)</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Force</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>newton (N), dyne (dyn), poundforce (lbf), kip</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Energy</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>joule (J), erg, Wh, BTU, electronvolt (eV)</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Power</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>watt (W), hp</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Pressure</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Pa, psi, atm, torr, bar, mmHg, mmH2O, cmH2O</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Electricity and magnetism</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>ampere (A), coulomb (C), watt (W), volt (V), ohm, farad (F), weber (Wb), tesla (T), henry (H), siemens (S), electronvolt (eV)</td>
                  </tr>
                  <tr>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Binary</td>
                     <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>bits (b), bytes (B)</td>
                  </tr>
               </tbody>
            </table>
            <p style={{ marginTop: '1rem' }}>
               You can use these units in your calculations and conversions. For example:
            </p>
            <ul style={{ listStyleType: 'none', padding: '0 1rem' }}>
               <li>2 inch to cm = 5.08 cm</li>
               <li>cos(45 deg) = 0.707</li>
               <li>90 km/h to m/s = 25 m/s</li>
               <li>100000 N / m^2 = 100 kPa</li>
               <li>9.81 m/s^2 * 100 kg * 40 m = 39.24 kJ</li>
               <li>460 V * 20 A * 30 days to kWh = 6624 kWh</li>
            </ul>

            <p style={{ marginTop: '1rem' }}>
               You can also use <span>variables</span> in your calculations. Here's an example of calculating energy consumption:
            </p>
            <span>Define variables</span>
            <p>Vol = 460 V;
               I = 20 A;
               D = 30 days
            </p>
            <span>Calculate energy in kWh</span>
            <p>Vol * I * D to kWh = 6624 kWh</p>
            <p>
               <span style={{ color: 'var(--primary-color)' }}>Note: When defining variables, make sure not to use names that match unit symbols (like "V" for volts or "A" for amperes) to avoid conflicts.</span>
            </p>
         </div>
         <div style={{ border: '1px solid var(--primary-color)', padding: '1rem', borderRadius: 'var(--button-border-radius)' }}>
            <h3 style={{ textAlign: 'center' }}>Complex Numbers</h3>
            <p>
               For <span>algebraic form</span>, use the format <span>a + b*i</span>.
            </p>
            <p>The multiplication sign is <span>mandatory</span> when working with <span>variables</span>, otherwise the calculator will think you have a variable <span>bi</span></p>
            <p>
               In <span>polar form</span>, <span>degrees</span> are always used
               both for manual input and internal calculations.
            </p>
            <p>
               When you press the <button style={{ padding: '0.15rem 1rem' }}>To Polar</button> button, the complex value output will be in degrees, not radians.
            </p>
         </div>
         <div style={{ border: '1px solid var(--primary-color)', padding: '1rem', borderRadius: 'var(--button-border-radius)' }}>
            <h3 style={{ textAlign: 'center' }}>Variables</h3>
            <p>
               To create a variable, click the <button style={{ padding: '0.15rem 1rem' }}>Variables</button> button. A window will appear where you can <span>name your variable</span>. The current value in the input field will be assigned to this variable.
            </p>
            <p>
               You can <span>find all created variables</span> in the history section for later use. Access the history by clicking the <button style={{ padding: '0.15rem 1rem' }}>history</button> button, then select <button style={{ padding: '0.15rem 1rem' }}>Variables</button> to view your saved variables.
            </p>
            <p>
               Use variables in your calculations by simply typing their names in the input field.
            </p>
         </div>
         <div style={{ border: '1px solid var(--primary-color)', padding: '1rem', borderRadius: 'var(--button-border-radius)' }}>
            <h3 style={{ textAlign: 'center' }}>Interacting with History</h3>
            <p>
               When solving multi-step problems, you often need to use previously calculated values. To streamline this process, we've added the following buttons:
            </p>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
               <li><button style={{ padding: '0.15rem 1rem', margin: '0.2rem' }}>Paste Input</button> - pastes the entered expression</li>
               <li><button style={{ padding: '0.15rem 1rem', margin: '0.2rem' }}>Paste Result</button> - pastes the calculation result</li>
               <li><button style={{ padding: '0.15rem 1rem', margin: '0.2rem' }}>Paste Variable</button> - pastes the variable name</li>
               <li><button style={{ padding: '0.15rem 1rem', margin: '0.2rem' }}>Paste Value</button> - pastes the variable value</li>
            </ul>
            <p>
               Clicking any of these buttons will copy the selected information and automatically append it to the end of the main input field. This allows you to quickly use previous calculations or variables in new computations.
            </p>
            <p>
               To access your history, click the <button style={{ padding: '0.15rem 1rem' }}>history</button> button. In the history window, you can switch between calculation history and saved variables using the <button style={{ padding: '0.15rem 1rem' }}>Variables/Calculations</button> toggle button.
            </p>
         </div>
         <div style={{ border: '1px solid var(--primary-color)', padding: '1rem', borderRadius: 'var(--button-border-radius)' }}>
            <strong style={{ color: 'var(--primary-color)' }}>
               All additional windows, including history cards, can be closed by clicking anywhere outside of the cards.
            </strong>
         </div>
      </div>
   </Modal>
);