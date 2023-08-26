import React from "react";

const Dice = ({ val }) => {

    const makeDots = () => {
        if(val === 1) {
            return(<div className="rounded-full bg-[#46474B] h-[8px] w-[8px]" />);
        } else if(val === 2) {
            return(
                <div className="flex">
                    <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] mb-[13px] mr-[4px]" />
                    <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] mt-[13px] ml-[4px]" /> 
                </div>
            );
        } else if(val === 3) {
            return(
                <div className="flex">
                    <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] mr-[2px] mb-[-3px] mt-[13px]" />
                    <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] my-[2px] mt-[5px] bt-[5px]" />
                    <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] ml-[2px] mt-[-3px] mb-[13px]" />
                </div>
            );
        } else if(val === 4) {
            return(
                <div className="flex flex-col justify-center items-center">
                    <div className="flex mb-[5px]">
                        <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] mr-[5px]" />
                        <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] ml-[5px]" />
                    </div>
                    <div className="flex mt-[5px]">
                        <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] mr-[5px]" />
                        <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] ml-[5px]" />
                    </div>
                </div>
            );
        } else if(val === 5) {
            return(
                <div className="flex flex-col justify-center items-center">
                    <div className="flex mb-[2px]">
                        <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] mr-[5px]" />
                        <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] ml-[5px]" />
                    </div>
                    <div className="rounded-full bg-[#46474B] h-[8px] w-[8px]" />
                    <div className="flex mt-[2px]">
                        <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] mr-[5px]" />
                        <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] ml-[5px]" />
                    </div>
                </div>
            );
        } else if(val === 6) {
            return(
                <div className="flex flex-col justify-center items-center">
                    <div className="flex mb-[2px]">
                        <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] mr-[5px]" />
                        <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] ml-[5px]" />
                    </div>
                    <div className="flex m-[1px]">
                        <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] mr-[5px]" />
                        <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] ml-[5px]" />
                    </div>
                    <div className="flex mt-[2px]">
                        <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] mr-[5px]" />
                        <div className="rounded-full bg-[#46474B] h-[8px] w-[8px] ml-[5px]" />
                    </div>
                </div>
            );
        }
    };

    return(
        <div className="h-[50px] w-[50px] rounded-md bg-[#C0534C] mt-36 m-4 flex justify-center items-center shadow-xl shadow-yellow-100">
            <div className="h-[40px] w-[40px] rounded-md bg-[#F3726D] flex justify-center items-center">
                {makeDots()}
            </div>
        </div>
    );
};

export default Dice;