## Functions

<dl>
<dt><a href="#checkLengths">checkLengths(...arrays)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if all arrays are the same size</p>
</dd>
<dt><a href="#sortMultipleArrays">sortMultipleArrays(arrayToSortBy, sortParams, arraysToSort)</a> ⇒ <code><a href="#SortResult">SortResult</a></code></dt>
<dd><p>Sorts multiple arrays based on master array sort order</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#SortParams">SortParams</a></dt>
<dd></dd>
<dt><a href="#SortResult">SortResult</a></dt>
<dd></dd>
</dl>

<a name="checkLengths"></a>

## checkLengths(...arrays) ⇒ <code>boolean</code>

Checks if all arrays are the same size

**Kind**: global function

| Param     | Type                                         | Description               |
| --------- | -------------------------------------------- | ------------------------- |
| ...arrays | <code>Array.&lt;Array.&lt;any&gt;&gt;</code> | Arrays to check length of |

<a name="sortMultipleArrays"></a>

## sortMultipleArrays(arrayToSortBy, sortParams, arraysToSort) ⇒ [<code>SortResult</code>](#SortResult)

Sorts multiple arrays based on master array sort order

**Kind**: global function  
**Returns**: [<code>SortResult</code>](#SortResult) - The sorted master array and the sorted resulting arrays

| Param         | Type                                         | Description                               |
| ------------- | -------------------------------------------- | ----------------------------------------- |
| arrayToSortBy | <code>Array.&lt;any&gt;</code>               | Master array to sort the others arrays by |
| sortParams    | [<code>SortParams</code>](#SortParams)       | Parameters to sort master array           |
| arraysToSort  | <code>Array.&lt;Array.&lt;any&gt;&gt;</code> | Arrays to sort                            |

<a name="SortParams"></a>

## SortParams

**Kind**: global typedef  
**Properties**

| Name        | Type                                                          | Default                       | Description                                                                                   |
| ----------- | ------------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------- |
| [sortProp]  | <code>string</code>                                           |                               | Property to sort by, if value to sort by is object. Supports nested props, like 'propA.propB' |
| [sortOrder] | <code>&#x27;asc&#x27;</code> \| <code>&#x27;desc&#x27;</code> | <code>&quot;desc&quot;</code> | Whether to use ascending or descending order to sort                                          |

<a name="SortResult"></a>

## SortResult

**Kind**: global typedef  
**Properties**

| Name         | Type                                         |
| ------------ | -------------------------------------------- |
| masterArray  | <code>Array.&lt;any&gt;</code>               |
| sortedArrays | <code>Array.&lt;Array.&lt;any&gt;&gt;</code> |
