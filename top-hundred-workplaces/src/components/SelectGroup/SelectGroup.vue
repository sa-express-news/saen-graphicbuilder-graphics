<template>
    <div class="select-group">
        <label class="wrap">Large
            <input type="radio" name="group" checked="checked" value="large" @input="$emit('group-changed', $event.target.value)">
            <span class="checkmark"></span>
        </label>

        <label class="wrap">Medium
            <input type="radio" name="group" value="medium" @input="$emit('group-changed', $event.target.value)">
            <span class="checkmark"></span>
        </label>

        <label class="wrap">Small
            <input type="radio" name="group" value="small" @input="$emit('group-changed', $event.target.value)">
            <span class="checkmark"></span>
        </label>
    </div>
</template>

<script>
export default {
    name: 'select-group',
}
</script>

<style lang="scss">
@import '~express-news-styleguide/init-base';

/* Customize the label (the wrap) */
.wrap {
  display: inline-block;
  position: relative;
  padding-left: 28px;
  margin-bottom: 10px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 14px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

    /* Hide the browser's default radio button */
    input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    /* On mouse-over, add a grey background color */
    &:hover input ~ .checkmark {
        background-color: #ccc;
    }

    /* When the radio button is checked, add a red background */
    input:checked ~ .checkmark {
        background-color: $red;

        /* Show the indicator (dot/circle) when checked */
        &:after {
            display: block;
        }
    }
}

/* Create a custom radio button */
.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #eee;
    border-radius: 50%;

    &:after {
        content: "";
        position: absolute;
        display: none;
    }
}

/* Style the indicator (dot/circle) */
.wrap .checkmark:after {
    top: 7px;
    left: 7px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: white;
}
</style>