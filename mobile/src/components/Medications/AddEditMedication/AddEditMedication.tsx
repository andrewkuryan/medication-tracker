import React, { FunctionComponent, useState } from 'react';
import {
  SafeAreaView, Text, TextInput, TouchableOpacity, View, ScrollView,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useDispatch } from 'react-redux';

import { calculateEndDate } from '@common/models/shared/Medication';
import { AppDispatch } from '@store/ReduxStore';
import { create as createMedication } from '@store/medication/reducer';
import { CreateStartPayload } from '@store/medication/middleware';
import { isDefinedObject, parser, ParserConfig } from '@components/form/Parser';
import { ErrorsObject, validator, ValidatorConfig } from '@components/form/Validator';

import Styles from './AddEditMedication.styles';

interface AddEditForm {
    name: string;
    description: string;
    frequency: {
        amount: string;
        days: string
    },
    destinationCount: string;
    startDate: Date | null;
}

const numberParser = (value: string) => parseInt(value, 10);

const parserConfig: ParserConfig<CreateStartPayload, AddEditForm> = {
  name: (value) => value || undefined,
  description: (value) => value || null,
  frequency: parser({
    amount: numberParser,
    days: numberParser,
  }),
  destinationCount: numberParser,
  startDate: (value) => value ?? undefined,
};

const numberValidator = (value: number | undefined) => ((!value || Number.isNaN(value)) ? 'Should be a number' : undefined);

const validatorConfig: ValidatorConfig<CreateStartPayload> = {
  name: (value) => (!value || value.length === 0 ? 'Should not be empty' : undefined),
  description: () => undefined,
  frequency: validator({
    amount: numberValidator,
    days: numberValidator,
  }),
  destinationCount: numberValidator,
  startDate: (value) => (!value ? 'Should not be empty' : undefined),
};

type CalculateModelParams = Pick<CreateStartPayload, 'startDate' | 'frequency' | 'destinationCount'>;
type CalculateFormParams = Pick<AddEditForm, 'startDate' | 'frequency' | 'destinationCount'>;

function useEndDate(params: CalculateFormParams) {
  const data = parser<CalculateModelParams, CalculateFormParams>({
    startDate: parserConfig.startDate,
    frequency: parserConfig.frequency,
    destinationCount: parserConfig.destinationCount,
  })(params);

  const errors = validator<CalculateModelParams>(validatorConfig)(data);
  if (errors.startDate) return 'Specify Start Date';
  if (errors.destinationCount) return 'Specify Destination Count';
  if (errors.frequency?.amount) return 'Specify Frequency Amount';
  if (errors.frequency?.days) return 'Specify Frequency Days';

  if (isDefinedObject(data) && Object.keys(errors).length === 0) {
    return calculateEndDate(data.startDate, data.destinationCount, data.frequency);
  }
  return undefined;
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const AddEditMedication: FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('1');
  const [days, setDays] = useState('1');
  const [destinationCount, setDestinationCount] = useState('');
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);

  const endDate = useEndDate({ startDate, destinationCount, frequency: { amount, days } });

  const [errors, setErrors] = useState<ErrorsObject<CreateStartPayload>>({});

  const handleSubmit = () => {
    const data = parser(parserConfig)({
      name, description, frequency: { amount, days }, destinationCount, startDate,
    });
    const validationResult = validator(validatorConfig)(data);
    setErrors(validationResult);

    if (isDefinedObject(data) && Object.keys(validationResult).length === 0) {
      dispatch(createMedication(data));
    }
  };

  return (
    <SafeAreaView style={Styles.addEditRoot}>
        <ScrollView>
            <View style={Styles.formWrapper}>
                <View style={Styles.fieldWrapper}>
                    <Text style={Styles.fieldLabel}>Name*</Text>
                    <TextInput
                        style={[Styles.inputField, Styles.textInputField]}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="none"
                    />
                    {errors.name && <Text style={Styles.fieldError}>{errors.name}</Text>}
                </View>
                <View style={Styles.fieldWrapper}>
                    <Text style={Styles.fieldLabel}>Description</Text>
                    <TextInput
                        style={[Styles.inputField, Styles.textInputField]}
                        multiline
                        value={description}
                        onChangeText={setDescription}
                        autoCapitalize="none"
                    />
                </View>
                <View style={Styles.frequencyWrapper}>
                    <View style={[Styles.fieldWrapper, Styles.frequencyFieldWrapper]}>
                        <Text style={Styles.fieldLabel}>Amount*</Text>
                        <TextInput
                            style={[Styles.inputField, Styles.textInputField]}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                        {errors.frequency?.amount && <Text style={Styles.fieldError}>
                            {errors.frequency?.amount}
                        </Text>}
                    </View>
                    <View style={[Styles.fieldWrapper, Styles.frequencyFieldWrapper]}>
                        <Text style={Styles.fieldLabel}>Days*</Text>
                        <TextInput
                            style={[Styles.inputField, Styles.textInputField]}
                            keyboardType="numeric"
                            value={days}
                            onChangeText={setDays}
                        />
                        {errors.frequency?.days
                            && <Text style={Styles.fieldError}>{errors.frequency?.days}</Text>}
                    </View>
                </View>
                <View style={Styles.fieldWrapper}>
                    <Text style={Styles.fieldLabel}>Destination Count*</Text>
                    <TextInput
                        style={[Styles.inputField, Styles.textInputField]}
                        keyboardType="numeric"
                        value={destinationCount}
                        onChangeText={setDestinationCount}
                    />
                    {errors.destinationCount && <Text style={Styles.fieldError}>
                        {errors.destinationCount}
                    </Text>}
                </View>
                <View style={Styles.fieldWrapper}>
                    <Text style={Styles.fieldLabel}>Start Date*</Text>
                    <TouchableOpacity
                        style={Styles.inputField}
                        onPress={() => setDatePickerOpen(true)}
                    >
                        <Text
                            style={[
                              Styles.textInputField,
                              ...(startDate == null ? [Styles.datePickerTextPlaceholder] : []),
                            ]}
                        >
                            {startDate ? formatDate(startDate) : 'Click to Select'}
                        </Text>
                    </TouchableOpacity>
                    {errors.startDate && <Text style={Styles.fieldError}>
                        {errors.startDate}
                    </Text>}
                    <DatePicker
                        modal
                        open={isDatePickerOpen}
                        mode="date"
                        title="Select Start Date"
                        date={startDate ?? new Date()}
                        onConfirm={(date) => {
                          setDatePickerOpen(false);
                          setStartDate(date);
                        }}
                        onCancel={() => {
                          setDatePickerOpen(false);
                        }}
                    />
                </View>
                <View style={Styles.fieldWrapper}>
                    <Text style={Styles.fieldLabel}>End Date</Text>
                    <View style={Styles.inputField}>
                        <Text
                            style={[
                              Styles.textInputField,
                              ...(endDate instanceof Date
                                ? []
                                : [Styles.datePickerTextPlaceholder]),
                            ]}
                        >
                            {endDate && endDate instanceof Date ? formatDate(endDate) : (endDate ?? '')}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={Styles.submitButton} onPress={handleSubmit}>
                    <Text style={Styles.submitButtonText}>Create</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default AddEditMedication;
