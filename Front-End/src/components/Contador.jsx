import React from "react";

function Counter({ count = 0, sexo = "", upClick = null, downClick = null }) {
  return (
    <section className="text-4xl text-center grid grid-rows-3 gap-1 border p-4 h-fill items-center rounded-lg">
      <div onClick={upClick} className="group cursor-pointer m-auto">
        <img
          className="transition-all w-1/2 m-auto  group-hover:scale-75"
          srcSet={"/imgs/circle-chevron-up-solid.svg"}
        />
      </div>
      <div className="row-span-2">
        {count} <br />
        {sexo}
      </div>
      <div onClick={downClick} className="group cursor-pointer m-auto">
        <img
          className="transition-all w-1/2 m-auto  group-hover:scale-75"
          srcSet={"/imgs/circle-chevron-down-solid.svg"}
        />
      </div>
    </section>
  );
}

export default Counter;
