import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Select from "react-select";
import { loadData, bookSearch, generateBookArray } from "./components/Core";

var defaultUiParams = {};

function App() {
  const [uiOptions, setUiOptions] = useState(defaultUiParams);
  const [book, setBook] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setcurrentPage] = useState(0);
  const [terms, setterms] = useState([]);
  const [highlights, sethighlights] = useState([]);

  useEffect(() => {
    if (!book || !searchQuery) return;
    var result = searchQuery.split(" ").filter((word) => word.length >= 2);
    setterms(result);
  }, [searchQuery]);

  useEffect(() => {
    if (!book || !searchQuery) return;
    sethighlights(terms.map((word) => bookSearch({ pageArray: book, word })));
  }, [terms]);

  useEffect(() => {
    if (!book) return;
  }, [setcurrentPage]);

  useEffect(async () => {
    var d = await loadData();
    setBook(generateBookArray(d));

    // bookSearch
    // generateBookArray
  }, []);

  console.log({ book });

  if (!book) return <div>Loading!</div>;

  // console.log(bookSearch({ pageArray: book, word: "cunt" }));

  // const SearchableDropdown = ({ label, options, selectParams }) => {
  //   const set = (e) => setUiOptions({ ...uiOptions, [label]: e });
  //   return (
  //     <div>
  //       {/*this select package really fucking sucks ass, the style application
  //        system is garbo and akin to banging rocks together */}
  //       <Select
  //         // isClearable
  //         {...selectParams}
  //         // placeholder={''}
  //         value={uiOptions[label]}
  //         onChange={set}
  //         // theme={themes[uiOptions.selectedTheme.value]}
  //         // styles={dropDownStyles}
  //         options={options}
  //       />
  //     </div>
  //   );
  // };
  // const Checkbox = ({ label, secretMessage }) => {
  //   const set = (e) =>
  //     setUiOptions({ ...uiOptions, [label]: !uiOptions[label] });
  //   return (
  //     <div title={secretMessage}>
  //       <input
  //         name={label}
  //         type='checkbox'
  //         checked={uiOptions[label]}
  //         onChange={set}
  //       />
  //       <div>{label}</div>
  //     </div>
  //   );
  // };

  const Table = ({ page, data2d = [], highlights }) => {
    console.log({ highlights });
    return (
      <table>
        {/*   <thead>
          <tr>
            <th></th>
          </tr>
        </thead>*/}
        <tbody>
          {data2d.map((d1, x) => (
            <tr>
              {d1.map((d2, y) => {
                var h = "";

                highlights.forEach((word, termHighlightNo) =>
                  word.forEach((pg) =>
                    pg.forEach((cell, i) => {
                      if (cell.x == x && cell.y == y && cell.page == page) {
                        h = "red";
                      }
                    })
                  )
                );

                return <td className={`${h} page${page} x${x} y${y}`}>{d2}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const SmallTable = ({ data2d = [] }) => {
    return (
      <table>
        {/*   <thead>
          <tr>
            <th></th>
          </tr>
        </thead>*/}
        <tbody>
          {data2d.map((d1, x) => (
            <tr>
              {d1.map((d2, y) => {
                var h = "";

                return <td onClick={()=>setcurrentPage(d2)} className={``}>{d2}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  console.log({
    ok: highlights
      .flat()
      .flat()
      .map((g) => g.page),
  });

  return (
    <div className="App">
      <div></div>
      <div>
        <label htmlFor={"searchQuery"}>Search Query</label>
        <input
          name={"searchQuery"}
          type={"text"}
          onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
          value={searchQuery}
          placeholder={"searchQuery"}
        />
      </div>
      searchQuery
      <div>
        <div>
          currentPage:{currentPage + 1}/{book.length}
        </div>
        <div
          onClick={(e) =>
            setcurrentPage(currentPage >= 0 ? currentPage + 1 : currentPage)
          }
        >
          Next page
        </div>
        <div
          onClick={(e) =>
            setcurrentPage(currentPage > 0 ? currentPage - 1 : currentPage)
          }
        >
          Previous page
        </div>
      </div>

      <div>  <div>
            <SmallTable
              data2d={[
                book
                  .map((b, i) => i)
                  .filter((i) =>
                    highlights
                      .flat()
                      .flat()
                      .map((g) => g.page)
                      .includes(i)
                  ),
              ]}
            />
          </div>

          <div>
            {terms.map((term, i) => (
              <div>
                {term}: {highlights[i]?.length || 0}
              </div>
            ))}
          </div>
</div>

        
      
      <div>


        <div>Table</div>
        <div>
          <Table
            page={currentPage}
            data2d={book[currentPage]}
            highlights={highlights}
          />

        </div>
      </div>
    </div>
  );
}

export default App;
