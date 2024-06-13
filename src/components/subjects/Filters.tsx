import styles from "@/app/(logged-in)/subjects/styles.module.css";
import {AutoComplete, Button, Divider, Flex, Input, Radio, Spin, Tag} from "antd";
import {TweenOneGroup} from "rc-tween-one";
import {debounce} from "lodash";
import {PlusOutlined} from "@ant-design/icons";
import React from "react";


// @ts-ignore
export default function Filters({withExam, setWithExam, teacherFirstName, setTeacherFirstName, teacherLastName, setTeacherLastName, tags, setTags, tagsLoading, tagInputVisible, setTagInputVisible, tagInputValue, setTagInputValue, tagOptions, setTagOptions, tagInputRef, tagDropdownVisible, setTagDropdownVisible, searchTags, removeTag, showInput, onInputChange, onInputConfirm, resetFilters, applyFilters, style}) {
    return (
        <div className={styles.filters} style={style}>
            <h2>Фільтри</h2>

            <Divider style={{margin: "10px 0"}}/>

            <h4 style={{marginBottom: 5}}>Екзамен:</h4>
            <Radio.Group
                value={withExam}
                onChange={e => {
                    setWithExam(e.target.value);
                }}
            >
                <Radio value={1}>З</Radio>
                <Radio value={2}>Без</Radio>
            </Radio.Group>

            <Divider style={{margin: "10px 0"}}/>

            <h4 style={{marginBottom: 5}}>Вчитель:</h4>
            <div>
                <Flex gap={38}>
                    <p>Ім'я:</p>
                    <Input
                        value={teacherFirstName}
                        onChange={e => setTeacherFirstName(e.target.value)}
                        size="small"
                    />
                </Flex>

                <Flex style={{marginTop: 10}} gap={10}>
                    <p>Фамілія:</p>
                    <Input
                        value={teacherLastName}
                        onChange={e => setTeacherLastName(e.target.value)}
                        size="small"
                    />
                </Flex>
            </div>

            <Divider style={{margin: "10px 0"}}/>

            <h4>Теги:</h4>
            <div>
                <TweenOneGroup
                    appear={false}
                    enter={{scale: 0.8, opacity: 0, type: 'from', duration: 100}}
                    leave={{opacity: 0, width: 0, scale: 0, duration: 200}}
                    style={{display: "inline-block"}}
                    onEnd={(e) => {
                        if (e.type === 'appear' || e.type === 'enter') {
                            (e.target as any).style = 'display: inline-block';
                        }
                    }}
                >
                    {/* @ts-ignore */}
                    {tags.map(tag =>
                        <span key={tag} style={{display: "inline-block"}}>
                                <Tag
                                    style={{marginTop: 10}}
                                    closable
                                    onClose={(e) => {
                                        e.preventDefault();
                                        removeTag(tag)
                                    }}
                                >
                                    {tag}
                                </Tag>
                        </span>
                    )}
                </TweenOneGroup>

                {tagInputVisible
                    ? <AutoComplete
                        ref={tagInputRef}
                        style={{width: 140, height: 25, marginTop: 10}}
                        value={tagInputValue}
                        onChange={onInputChange}
                        onBlur={onInputConfirm}
                        backfill
                        options={tagOptions}
                        onSelect={tag => setTagInputValue(tag)}
                        onDropdownVisibleChange={open => setTagDropdownVisible(open)}
                        onSearch={debounce(searchTags, 400)}
                        onKeyDown={e => {
                            if (e.key == "Enter" && !tagDropdownVisible) {
                                onInputConfirm();
                            }
                        }}
                        notFoundContent={tagsLoading && <Spin spinning style={{display: "block", margin: "auto"}}/>}
                    />
                    : <Tag
                        onClick={showInput}
                        style={{
                            borderStyle: "dashed",
                            cursor: "pointer",
                            display: "inline-block",
                            marginTop: 10
                        }}
                        color="cyan"
                    >
                        <PlusOutlined/> Добавити
                    </Tag>
                }
            </div>

            <Divider style={{margin: "10px 0"}}/>

            <div style={{width: "fit-content", display: "block", marginLeft: "auto"}}>
                <Button onClick={resetFilters} size="small" style={{fontSize: 14, marginRight: 5}}>Скинути</Button>
                <Button onClick={applyFilters} size="small" style={{fontSize: 14}}
                        type="primary">Застосувати</Button>
            </div>
        </div>
    );
}