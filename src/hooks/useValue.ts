import { watch, onMounted, ref } from 'vue';
export const useValue = (props: any, emit: any) => {
    const value = ref(false);

    onMounted(() => {
        value.value = props.modelValue;
    });

    watch(() => props.modelValue, val => {
        value.value = val;
    });

    watch(() => value.value, val => {
        emit('update:modelValue', val);
    })
    return value;
}