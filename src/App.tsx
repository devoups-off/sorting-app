import React, {useState} from "react";
import "./App.scss";
import {FaBeer, FaSkull} from "react-icons/fa";

interface ColumnProps {
    value: number;
    index: number;
}

const Column: React.FC<ColumnProps> = ({value, index}) => {
    return (
        <div className="column" style={{height: value * 14}}>
        </div>
    );
};

interface ColumnListProps {
    values: number[];
}

const shuffle = (array: number[]) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const ColumnList: React.FC<ColumnListProps> = ({values}) => {
    const [sortedValues, setSortedValues] = useState<number[]>(values);
    const [withDelay, setWithDelay] = useState<boolean>(true);
    const [delay, setDelay] = useState<number>(10);
    const [isSorting, setIsSorting] = useState<boolean>(false);

    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const bubbleSort = async () => {
        setIsSorting(true);
        // Tri des valeurs (par exemple, le tri à bulles)
        for (let i = 0; i < sortedValues.length; i++) {
            for (let j = 0; j < sortedValues.length - i - 1; j++) {
                if (sortedValues[j] > sortedValues[j + 1]) {
                    const temp = sortedValues[j];
                    sortedValues[j] = sortedValues[j + 1];
                    sortedValues[j + 1] = temp;
                    if (withDelay) {
                        await sleep(delay);
                    }
                    setSortedValues([...sortedValues]);
                }
            }
        }
        setIsSorting(false);
    };

    const insertionSort = async () => {
        setIsSorting(true);
        const n = sortedValues.length;

        for (let i = 1; i < n; i++) {
            let key = sortedValues[i];
            let j = i - 1;

            while (j >= 0 && sortedValues[j] > key) {
                sortedValues[j + 1] = sortedValues[j];
                j--;
                if (withDelay) {
                    await sleep(delay);
                }
                setSortedValues([...sortedValues]);
            }
            sortedValues[j + 1] = key;
            if (withDelay) {
                await sleep(delay);
            }
            setSortedValues([...sortedValues]);
        }
        setIsSorting(false);
    };

    async function partition(arr: number[], low: number, high: number) {
        const pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                if (withDelay) {
                    await sleep(delay);
                }
                setSortedValues([...arr]);
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

        return i + 1;
    }

    async function quickSort(arr: number[], low: number = 0, high: number = arr.length - 1) {
        if (low < high) {
            const partitionIndex = await partition(arr, low, high);
            await quickSort(arr, low, partitionIndex - 1);
            await quickSort(arr, partitionIndex + 1, high);
        }
        setIsSorting(false);
        return arr;
    }

    const handleQuickSort = async () => {
        setIsSorting(true);
        setSortedValues(await quickSort([...values], 0, values.length - 1));
    }

    async function bogosort(arr: number[]){
        function isSorted(arr: number[]): boolean {
            for (let i = 1; i < arr.length; i++) {
                if (arr[i] < arr[i-1]) {
                    return false;
                }
            }
            return true;
        }

        while (!isSorted(arr)) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                if (withDelay) {
                    await sleep(delay);
                }
                setSortedValues([...arr]);
            }
        }
        setIsSorting(false);
        return arr;
    }



    const handleBogoSort = async () => {
        setIsSorting(true);
        setSortedValues(await bogosort(values));
    }

    const handleReset = () => {
        //setSortedValues([...values]);
        setSortedValues([...shuffle(values)]);
    };

    return (
        <div className="column-list-container">
            <div className="column-list">
                {sortedValues.map((value, index) => (
                    <Column key={index} value={value} index={index}/>
                ))}
            </div>
            <div className="button-container">
                <button disabled={isSorting} onClick={handleQuickSort}>Quick sort</button>
                <button disabled={isSorting} onClick={bubbleSort}>Bubble Sort</button>
                <button disabled={isSorting} onClick={insertionSort}>Insertion Sort</button>
                <button disabled={isSorting} onClick={handleBogoSort} className="bogosort"><FaSkull /> <p>bogosort</p></button>
                <button disabled={isSorting} onClick={handleReset}>Reset</button>
            </div>
            <div className="timer-container">
                <div>
                    <p>delay</p>
                    <input
                        disabled={isSorting}
                        checked={withDelay}
                        onChange={e => setWithDelay(e.target.checked)}
                        type="checkbox"/>
                </div>
                <div>
                    <p>ms</p>
                    <input
                        disabled={isSorting}
                        value={delay}
                        onChange={e => setDelay(parseInt(e.target.value))}
                        type="number"/>
                </div>
            </div>
        </div>
    );
};

export default function App() {

    let columns = [];
    for (let i = 0; i < 50; i++) {
        columns.push(i + 1);
    }

    shuffle(columns);

    return (
        <div className="App">
            <ColumnList values={columns}/>
        </div>
    );
}
