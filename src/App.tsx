import React, {useState} from "react";
import "./App.scss";
import {FaSkull} from "react-icons/fa";

interface ColumnProps {
    value: number;
    index: number;
}

const Column: React.FC<ColumnProps> = ({value, index}) => {
    return (
        <div className="column" style={{height: value * 10}}>
        </div>
    );
};

interface ColumnListProps {
    values: number[];
}

const shuffle = (array: number[]) => {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

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
    const [selectedSort, setSelectedSort] = useState<string>("bubbleSort");

    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const bubbleSort = async () => {
        setIsSorting(true);
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

    const partition = async (arr: number[], low: number, high: number) => {
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

    const quickSort = async (arr: number[], low: number = 0, high: number = arr.length - 1) => {
        if (low < high) {
            const partitionIndex = await partition(arr, low, high);
            await quickSort(arr, low, partitionIndex - 1);
            await quickSort(arr, partitionIndex + 1, high);
        }
        return arr;
    }

    const handleQuickSort = async () => {
        setIsSorting(true);
        setSortedValues(await quickSort([...values], 0, values.length - 1));
        setIsSorting(false);
    }

    const bogosort = async (arr: number[]) => {
        function isSorted(arr: number[]): boolean {
            for (let i = 1; i < arr.length; i++) {
                if (arr[i] < arr[i - 1]) {
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

    const stalinSort = async (arr: number[]) => {
        let sortedArr = [arr[0]]; // On commence avec le premier élément dans la liste triée

        for (let i = 1; i < arr.length; i++) {
            if (arr[i] >= sortedArr[sortedArr.length - 1]) {
                sortedArr.push(arr[i]); // On ajoute l'élément à la liste triée s'il est dans l'ordre
            }
            if (withDelay) {
                await sleep(delay);
            }
            setSortedValues([...sortedArr]);
        }

        return sortedArr; // On retourne la liste triée
    }


    const handleBogoSort = async () => {
        setIsSorting(true);
        setSortedValues(await bogosort(values));
    }



    const handleStalinSort = async () => {
        setIsSorting(true);
        setSortedValues(await stalinSort(values));
        setIsSorting(false);
    }

    const mergeSort = async (arr: number[], left: number = 0, right: number = arr.length - 1) => {
        if (left >= right) {
            return;
        }
        const middle = Math.floor((left + right) / 2);
        await mergeSort(arr, left, middle);
        await mergeSort(arr, middle + 1, right);
        await merge(arr, left, middle, right);
    }

    const merge = async (arr: number[], left: number, middle: number, right: number) => {
        const leftArr = arr.slice(left, middle + 1);
        const rightArr = arr.slice(middle + 1, right + 1);

        let i = 0,
            j = 0,
            k = left;

        while (i < leftArr.length && j < rightArr.length) {
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            if (withDelay) {
                await sleep(delay);
            }
            setSortedValues([...arr]);
            k++;
        }

        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            if (withDelay) {
                await sleep(delay);
            }
            setSortedValues([...arr]);
            i++;
            k++;
        }

        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            if (withDelay) {
                await sleep(delay);
            }
            setSortedValues([...arr]);
            j++;
            k++;
        }
    }

    const handleMergeSort = async (values: number[]) => {
        setIsSorting(true);
        await mergeSort(values);
        setIsSorting(false);
    }


    const selectionSort = async (arr: number[]) => {
        setIsSorting(true);
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
                if (withDelay) {
                    await sleep(delay);
                }
                setSortedValues([...arr]);
            }
        }
        setIsSorting(false);
        return arr;
    }


    const SortAlgorithms: any = {
        bubbleSort: {name: "Bubble sort", sortFunc: bubbleSort},
        insertionSort: {name: "Insertion sort", sortFunc: insertionSort},
        quickSort: {name: "Quick sort", sortFunc: handleQuickSort},
        bogosort: {name: "Bogosort", sortFunc: handleBogoSort},
        stalinSort: {name: "Stalin sort", sortFunc: handleStalinSort},
        mergeSort: {name: "Merge Sort", sortFunc: handleMergeSort},
        selectionSort: {name: "Selection Sort", sortFunc: selectionSort},
    };

    const handleReset = () => {
        setSortedValues([...shuffle(values)]);
    };

    const handleSort = async () => {
        await SortAlgorithms[selectedSort].sortFunc(values);
    };

    return (
        <div className="column-list-container">
            <div className="column-list">
                {sortedValues.map((value, index) => (
                    <Column key={index} value={value} index={index}/>
                ))}
            </div>
            <div className="button-container">
                <select value={selectedSort} onChange={e => setSelectedSort(e.target.value)}>
                    {Object.keys(SortAlgorithms).map(sortKey => (
                        <option key={sortKey} value={sortKey}>
                            {sortKey}
                        </option>
                    ))}
                </select>
                <button onClick={handleSort} disabled={isSorting}>
                    {isSorting ? "Sorting..." : "Sort"}
                </button>
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
    for (let i = 0; i < 70; i++) {
        columns.push(i + 1);
    }

    shuffle(columns);

    return (
        <div className="App">
            <ColumnList values={columns}/>
        </div>
    );
}
